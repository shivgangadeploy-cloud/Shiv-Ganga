import crypto from "node:crypto";
import Booking from "../models/Booking.model.js";
import Room from "../models/Room.model.js";
import User from "../models/User.model.js";
import { generateGuestId } from "../utils/generateGuestId.js";
import { generateBookingReference } from "../utils/generateBookingReference.js";
import { sendBookingConfirmationMail } from "../services/mail.service.js";
import Transaction from "../models/Transaction.model.js";
import Coupon from "../models/Coupon.model.js";
import Razorpay from "razorpay";
import { config } from "../configs/env.js";
import { notifyReceptionistPaymentCompleted } from "../services/notification.service.js";
import TaxesAndBilling from "../models/TaxesAndBilling.model.js";
import Membership from "../models/Membership.model.js";

const getBillingSettings = async () => {
  const settings = await TaxesAndBilling.findOne({ isActive: true });
  if (!settings) {
    throw new Error("Taxes & billing settings not configured");
  }
  return settings;
};

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_SECRET,
});

const ADD_ONS_PRICE_MAP = {
  "River Rafting": 2500,
  "Bungee Jumping": 4000,
  "Ganga Aarti": 0,
  "Yoga Session": 1500,
};

const SERVICE_FEE = 600;
const TOURISM_FEE = 500;

export const createOfflineBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      firstName,
      lastName,
      email,
      phoneNumber,
      specialRequest,
      checkInDate,
      checkOutDate,
      adults,
      children,
      addOns = [],
      paymentMethod,
      couponCode,
      extraBedsCount = 0,
      id,
      idDocument,
      isMember = false, // ✅ Add this parameter
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }

    const billingSettings = await getBillingSettings();
    const extraBedPrice = billingSettings.extraBedPricePerNight;

    const roomAmount = nights * room.pricePerNight;

    const addOnsAmount = addOns.reduce((sum, a) => {
      const price = ADD_ONS_PRICE_MAP[a.name] || 0;
      return sum + price * a.quantity;
    }, 0);

    const extraBedsAmount =
      extraBedsCount > 0 ? extraBedsCount * extraBedPrice * nights : 0;

    const baseAmount = roomAmount + addOnsAmount + extraBedsAmount;

    const grossAmount = baseAmount + SERVICE_FEE + TOURISM_FEE;

    /* ================= MEMBERSHIP DISCOUNT ================= */
    let membershipDiscountAmount = 0;

    if (isMember === true) {
      const membership = await Membership.findOne({ isActive: true });

      if (membership) {
        if (membership.discountType === "PERCENT") {
          membershipDiscountAmount = Math.round(
            (baseAmount * membership.discountValue) / 100,
          );
        } else if (membership.discountType === "FLAT") {
          membershipDiscountAmount = Math.min(
            membership.discountValue,
            baseAmount,
          );
        }
      }
    }

    /* ================= COUPON DISCOUNT ================= */
    let couponDiscountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      const now = new Date();

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive coupon",
        });
      }

      // 🔥 START DATE CHECK
      if (coupon.startDate && now < coupon.startDate) {
        return res.status(400).json({
          success: false,
          message: "Coupon not active yet",
        });
      }

      // 🔥 EXPIRY CHECK
      if (coupon.expiryDate && coupon.expiryDate < now) {
        return res.status(400).json({
          success: false,
          message: "Coupon expired",
        });
      }

      couponDiscountAmount = Math.round(
        (baseAmount * coupon.discountPercent) / 100,
      );

      appliedCoupon = {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: couponDiscountAmount,
      };
    }

    /* ================= FINAL CALCULATION ================= */
    const totalDiscount = membershipDiscountAmount + couponDiscountAmount;

    const finalAmount = grossAmount - totalDiscount;
    const isPaid = paymentMethod === "cash";

    /* ================= USER CREATE / UPDATE ================= */
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        specialRequest,
        id,
        idDocument,
        isMember: isMember === true, // ✅ Save membership status
      });
    } else {
      user.id = id || user.id;
      user.idDocument = idDocument || user.idDocument;
      user.isMember = isMember === true ? true : user.isMember; // ✅ Update membership status
      await user.save();
    }

    /* ================= CREATE BOOKING ================= */
    const guestId = generateGuestId();
    const bookingReference = generateBookingReference({
      checkInDate,
      checkOutDate,
      firstName,
      lastName,
      phoneNumber: phoneNumber || "",
      email,
    });
    const bookingPayloadData = {
      guestId,
      bookingReference: bookingReference || null,
      room: room._id,
      user: user._id,
      checkInDate,
      checkOutDate,
      adults,
      children,
      addOns,
      extraBeds: {
        count: extraBedsCount,
        pricePerBed: extraBedPrice,
        totalPrice: extraBedsAmount,
      },
      totalAmount: finalAmount,
      paidAmount: isPaid ? finalAmount : 0,
      pendingAmount: isPaid ? 0 : finalAmount,
      membershipDiscount: membershipDiscountAmount,
      couponDiscount: couponDiscountAmount,
      bookingStatus: "confirmed",
      paymentStatus: isPaid ? "paid" : "pending",
      quantity: 1,
      serviceFee: SERVICE_FEE,
      tourismFee: TOURISM_FEE,
    };
    if (
      appliedCoupon &&
      typeof appliedCoupon === "object" &&
      Object.keys(appliedCoupon).length > 0
    ) {
      bookingPayloadData.coupon = appliedCoupon;
    }

    const booking = await Booking.create(bookingPayloadData);

    await room.save();

    await notifyReceptionistPaymentCompleted({ booking, user, room });

    const normalizeKey = (s) =>
      (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
    const normalizedPriceMap = Object.fromEntries(
      Object.entries(ADD_ONS_PRICE_MAP || {}).map(([k, v]) => [
        normalizeKey(k),
        v,
      ]),
    );
    const activities = (addOns || []).map((a) => {
      const qty = Math.max(0, Number(a?.quantity || 0));
      const name = (a?.name || "").toString().trim();
      const key = normalizeKey(name);
      const unit =
        (ADD_ONS_PRICE_MAP && ADD_ONS_PRICE_MAP[name]) ??
        normalizedPriceMap[key] ??
        (Number(a?.price || 0) || 0);
      return {
        name,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
      };
    });

    await sendBookingConfirmationMail({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      roomNumber: room.roomNumber,
      guestId: booking.guestId,
      bookingReference: booking.bookingReference,
      checkInDate: checkIn.toDateString(),
      checkOutDate: checkOut.toDateString(),
      nights,
      totalAmount: booking.totalAmount,
      paidAmount: booking.paidAmount,
      pendingAmount: booking.pendingAmount,
      membershipDiscount: membershipDiscountAmount, // ✅ Add this
      coupon: booking.coupon,
      activities,
    });

    res.status(201).json({
      success: true,
      message: "Offline booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOfflineBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("room", "roomNumber status")
      .populate("user", "firstName lastName email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    /* ================= UPDATE BOOKING ================= */
    booking.bookingStatus = "cancelled";

    // 🔧 FIX: paymentStatus clarity
    if (booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded"; // offline cash / manual refund
    } else {
      booking.paymentStatus = "cancelled";
    }

    booking.isCheckedIn = false;
    booking.isCheckedOut = false;
    booking.checkedInAt = null;
    booking.checkedOutAt = null;

    await booking.save();

    /* ================= RESET ROOM ================= */
    if (booking.room && booking.room.status !== "Available") {
      const room = await Room.findById(booking.room._id);
      if (room) {
        room.status = "Available";
        await room.save();
      }
    }

    /*
      🔔 FUTURE (OPTIONAL)
      If Razorpay/Transaction exists:
      await Transaction.updateMany(
        { booking: booking._id },
        { status: "CANCELLED" }
      );
    */

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const createOfflinePaymentOrder = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      addOns = [],
      couponCode,
      extraBedsCount = 0,
      paymentType = "FULL",
      firstName,
      lastName,
      email,
      phoneNumber,
      id,
      idDocument,
      amountInPaise,
      totalAmount,
      paidAmountNow,
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (nights <= 0)
      return res.status(400).json({ success: false, message: "Invalid dates" });

    const billingSettings = await getBillingSettings();
    const extraBedPrice = billingSettings.extraBedPricePerNight;

    const roomAmount = nights * room.pricePerNight;

    const addOnsAmount = addOns.reduce((sum, a) => {
      const price = ADD_ONS_PRICE_MAP[a.name] || 0;
      return sum + price * a.quantity;
    }, 0);

    const extraBedsAmount = extraBedsCount * extraBedPrice * nights;
    const baseAmount = roomAmount + addOnsAmount + extraBedsAmount;

    const grossAmount = baseAmount + SERVICE_FEE + TOURISM_FEE;

    if (couponCode && paymentType === "PARTIAL") {
      return res.status(400).json({
        success: false,
        message: "Coupon not allowed with partial payment",
      });
    }

    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      const now = new Date();

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive coupon",
        });
      }

      if (coupon.startDate && now < coupon.startDate) {
        return res.status(400).json({
          success: false,
          message: "Coupon not active yet",
        });
      }

      if (coupon.expiryDate && coupon.expiryDate < now) {
        return res.status(400).json({
          success: false,
          message: "Coupon expired",
        });
      }

      discountAmount = Math.round((grossAmount * coupon.discountPercent) / 100);

      appliedCoupon = {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
      };
    }

    const finalAmount = grossAmount - discountAmount;
    const backendTotal = totalAmount != null ? Number(totalAmount) : finalAmount;
    let payableNow =
      paymentType === "PARTIAL" ? Number(req.body.partialAmount) : finalAmount;

    if (amountInPaise != null && Number(amountInPaise) > 0) {
      payableNow = Number(amountInPaise) / 100;
    } else if (paidAmountNow != null && Number(paidAmountNow) > 0) {
      payableNow = Number(paidAmountNow);
    }

    if (payableNow <= 0 || payableNow > backendTotal) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const razorpayAmountPaise = (amountInPaise != null && Number(amountInPaise) > 0)
      ? Math.round(Number(amountInPaise))
      : Math.round(payableNow * 100);
    const order = await razorpay.orders.create({
      amount: razorpayAmountPaise,
      currency: "INR",
      receipt: `offline_${Date.now()}`,
    });

    /* ================= USER CREATE / UPDATE ================= */
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        id,
        idDocument,
      });
    } else {
      user.id = id || user.id;
      user.idDocument = idDocument || user.idDocument;
      await user.save();
    }

    const transactionAmount = backendTotal;
    const transaction = await Transaction.create({
      user: user._id,
      type: "OFFLINE_BOOKING_PAYMENT",
      paymentType,
      paidAmount: payableNow,
      amount: transactionAmount,
      razorpayOrderId: order.id,
      coupon: appliedCoupon,
      status: "PENDING",
    });

    res.json({
      success: true,
      order,
      transactionId: transaction._id,
      bookingPayload: {
        roomId,
        checkInDate,
        checkOutDate,
        adults,
        children,
        addOns,
        extraBeds: { count: extraBedsCount },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOfflinePayment = async (req, res, next) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId,
      bookingPayload,
    } = req.body;

    const transaction =
      await Transaction.findById(transactionId).session(session);
    if (!transaction) throw new Error("Transaction not found");

    if (transaction.status === "SUCCESS") {
      return res
        .status(400)
        .json({ success: false, message: "Already processed" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      transaction.status = "FAILED";
      await transaction.save({ session });
      throw new Error("Payment verification failed");
    }

    const user = await User.findById(transaction.user).session(session);
    if (!user) throw new Error("User not found for transaction");

    const room = await Room.findById(bookingPayload?.roomId).session(session);
    if (!room) throw new Error("Room not found for booking");

    const billingSettings = await getBillingSettings();
    const extraBedPrice = billingSettings.extraBedPricePerNight;

    const nights =
      (new Date(bookingPayload.checkOutDate) -
        new Date(bookingPayload.checkInDate)) /
      (1000 * 60 * 60 * 24);

    const extraBedsCount = bookingPayload.extraBeds?.count || 0;
    const extraBedsAmount = extraBedsCount * extraBedPrice * nights;

    const overlapping = await Booking.findOne({
      room: room._id,
      bookingStatus: "confirmed",
      isCheckedOut: { $ne: true },
      checkInDate: { $lt: bookingPayload.checkOutDate },
      checkOutDate: { $gt: bookingPayload.checkInDate },
    }).session(session);

    if (overlapping) throw new Error("Room already booked");

    transaction.status = "SUCCESS";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    await transaction.save({ session });

    const paidAmount = transaction.paidAmount;
    const pendingAmount = transaction.amount - paidAmount;

    const guestId = generateGuestId();
    const userDoc = await User.findById(transaction.user).session(session);
    const bookingReference = generateBookingReference({
      checkInDate: bookingPayload.checkInDate,
      checkOutDate: bookingPayload.checkOutDate,
      firstName: userDoc?.firstName || "",
      lastName: userDoc?.lastName || "",
      phoneNumber: userDoc?.phoneNumber || "",
      email: userDoc?.email || "",
    });

    const bookingData = {
      guestId,
      bookingReference: bookingReference || null,
      room: room._id,
      user: user._id,
      checkInDate: bookingPayload.checkInDate,
      checkOutDate: bookingPayload.checkOutDate,
      adults: bookingPayload.adults,
      children: bookingPayload.children,
      addOns: bookingPayload.addOns || [],
      quantity: bookingPayload.quantity || 1,
      extraBeds: {
        count: extraBedsCount,
        pricePerBed: extraBedPrice,
        totalPrice: extraBedsAmount,
      },
      totalAmount: transaction.amount,
      paidAmount,
      pendingAmount,
      paymentType: transaction.paymentType,
      paymentStatus: pendingAmount > 0 ? "pending" : "paid",
      bookingStatus: "confirmed",
    };
    if (
      transaction.coupon &&
      typeof transaction.coupon === "object" &&
      Object.keys(transaction.coupon).length > 0
    ) {
      bookingData.coupon = transaction.coupon;
    }

    const booking = await Booking.create([bookingData], { session });

    await room.save({ session });

    transaction.booking = booking[0]._id;
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const fakeVerifyOfflinePayment = async (req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ success: false, message: "DEV only" });
  }

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const { transactionId, bookingPayload } = req.body;

    const transaction =
      await Transaction.findById(transactionId).session(session);
    if (!transaction) throw new Error("Transaction not found");

    const user = await User.findById(transaction.user).session(session);
    const room = await Room.findById(bookingPayload.roomId).session(session);

    const billingSettings = await getBillingSettings();
    const extraBedPrice = billingSettings.extraBedPricePerNight;

    const nights =
      (new Date(bookingPayload.checkOutDate) -
        new Date(bookingPayload.checkInDate)) /
      (1000 * 60 * 60 * 24);

    const extraBedsCount = bookingPayload.extraBeds?.count || 0;
    const extraBedsAmount = extraBedsCount * extraBedPrice * nights;

    transaction.status = "SUCCESS";
    transaction.razorpayPaymentId = "DEV_PAYMENT";
    transaction.razorpaySignature = "DEV_SIGNATURE";
    await transaction.save({ session });

    const paidAmount = transaction.paidAmount;
    const pendingAmount = transaction.amount - paidAmount;

    const booking = await Booking.create(
      [
        {
          guestId: generateGuestId(),
          room: room._id,
          user: user._id,
          quantity: bookingPayload.quantity || 1,
          checkInDate: bookingPayload.checkInDate,
          checkOutDate: bookingPayload.checkOutDate,
          adults: bookingPayload.adults,
          children: bookingPayload.children,
          addOns: bookingPayload.addOns || [],
          extraBeds: {
            count: extraBedsCount,
            pricePerBed: extraBedPrice,
            totalPrice: extraBedsAmount,
          },
          totalAmount: transaction.amount,
          paidAmount,
          pendingAmount,
          paymentType: transaction.paymentType,
          paymentStatus: pendingAmount > 0 ? "pending" : "paid",
          bookingStatus: "confirmed",
        },
      ],
      { session },
    );

    await room.save({ session });

    transaction.booking = booking[0]._id;
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getBookingReceipt = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room", "roomNumber name pricePerNight")
      .populate("user", "firstName lastName email phoneNumber");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};


import Coupon from "../models/Coupon.model.js";

/**
 * CREATE COUPON (Immediate or Scheduled)
 */
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, startDate, expiryDate, usageLimit } = req.body;

    if (!code || !discountPercent) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and discount percent are required"
      });
    }

    const existing = await Coupon.findOne({
      code: code.toUpperCase()
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Coupon already exists"
      });
    }

    const now = new Date();

    // 🔥 FIX: scheduled coupon inactive rahega
    let isActive = true;
    if (startDate && new Date(startDate) > now) {
      isActive = false;
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercent,
      startDate: startDate || null,
      expiryDate: expiryDate || null,
      usageLimit: usageLimit || null,   // 🔥 NEW
      usageCount: 0,                    // 🔥 NEW
      isActive,
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

/**
 * APPLY COUPON (Schedule + Expiry + Usage Limit aware)
 */
export const applyCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and amount are required"
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive coupon"
      });
    }

    const now = new Date();

    // ⏱ START DATE CHECK
    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon not active yet"
      });
    }

    // ⛔ EXPIRY CHECK
    if (coupon.expiryDate && coupon.expiryDate < now) {
      coupon.isActive = false;
      await coupon.save();

      return res.status(400).json({
        success: false,
        message: "Coupon expired"
      });
    }

    // 🚫 USAGE LIMIT CHECK
    if (
      coupon.usageLimit !== null &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      coupon.isActive = false;
      await coupon.save();

      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached"
      });
    }

    // 💰 DISCOUNT CALCULATION
    const discountAmount = (amount * coupon.discountPercent) / 100;
    const finalAmount = amount - discountAmount;

    // 🔥 INCREMENT USAGE
    coupon.usageCount += 1;

    // 🔥 AUTO DEACTIVATE IF LIMIT REACHED
    if (
      coupon.usageLimit !== null &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      coupon.isActive = false;
    }

    await coupon.save();

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        finalAmount,
        remainingUses:
          coupon.usageLimit !== null
            ? coupon.usageLimit - coupon.usageCount
            : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DISABLE COUPON
 */
export const disableCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    coupon.isActive = false;
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon disabled successfully"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ENABLE COUPON
 */
export const enableCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    if (coupon.isActive === true) {
      return res.status(400).json({
        success: false,
        message: "Coupon is already active"
      });
    }

    coupon.isActive = true;
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon enabled successfully",
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCouponsForReceptionist = async (req, res, next) => {
  try {
    const coupons = await Coupon.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveCouponsForUser = async (req, res, next) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discountPercent, startDate, expiryDate, usageLimit } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    if (code) {
      const existing = await Coupon.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id }
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Another coupon with same code already exists"
        });
      }

      coupon.code = code.toUpperCase();
    }

    if (discountPercent !== undefined) coupon.discountPercent = discountPercent;
    if (startDate !== undefined) coupon.startDate = startDate;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;

    await coupon.save();

    res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    await Coupon.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


export const getAllCouponsForAdmin = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    count: coupons.length,
    data: coupons
  });
};

import User from "../models/User.model.js";
import Booking from "../models/Booking.model.js";
import Transaction from "../models/Transaction.model.js";

export const getGuestStats = async (req, res, next) => {
  try {
    const totalGuests = await User.countDocuments();

    const checkedInBookings = await Booking.find({
      bookingStatus: "confirmed",
      isCheckedIn: true,
      isCheckedOut: false
    }).lean();

    let checkedInGuests = 0;
    const activeUserIds = new Set();
    checkedInBookings.forEach(b => {
      const guestsCount = (b.adults || 0) + (b.children || 0);
      checkedInGuests += guestsCount;
      if (b.user) activeUserIds.add(b.user.toString());
    });

    const activeGuests = checkedInGuests;

    const inactiveGuests = Math.max(0, totalGuests - activeUserIds.size);

    res.json({
      success: true,
      totalGuests,
      checkedInGuests,
      activeGuests,
      inactiveGuests
    });
  } catch (error) {
    next(error);
  }
};

// export const getGuestList = async (req, res, next) => {
//   try {
//     const { search = "", page = 1, limit = 10 } = req.query;

//     const filter = {
//       bookingStatus: "confirmed"
//     };

//     const bookings = await Booking.find(filter)
//       .populate("user", "firstName lastName email phoneNumber")
//       .populate("room", "roomNumber name")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     // 🔥 SAFE MAPPING (null user protection)
//     const data = bookings
//       .filter(b => b.user) // ⛑️ VERY IMPORTANT
//       .filter(b => {
//         if (!search) return true;
//         const q = search.toLowerCase();
//         return (
//           b.user.firstName?.toLowerCase().includes(q) ||
//           b.user.lastName?.toLowerCase().includes(q) ||
//           b.user.email?.toLowerCase().includes(q)
//         );
//       })
//       .map(b => ({
//         id: b.user._id,
//         name: `${b.user.firstName} ${b.user.lastName}`,
//         email: b.user.email,
//         phoneNumber: b.user.phoneNumber,
//         currentRoom: b.room?.roomNumber || "—",

//         checkInDate: b.checkInDate,
//         checkOutDate: b.checkOutDate,

//         adults: b.adults || 0,
//         children: b.children || 0,
//         familyMembers: (b.adults || 0) + (b.children || 0),

//         status: b.isCheckedIn ? "CHECKED_IN" : "CHECKED_OUT"
//       }));

//     const total = data.length;

//     res.json({
//       success: true,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       data
//     });
//   } catch (error) {
//     console.error("❌ getGuestList error:", error);
//     next(error);
//   }
// };


export const getGuestList = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const userFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(userFilter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const userIds = users.map(u => u._id);

    // latest booking per user
    const bookings = await Booking.find({
      user: { $in: userIds }
    })
      .sort({ createdAt: -1 })
      .lean();

    const bookingMap = {};
    bookings.forEach((b) => {
      const key = b.user?.toString?.() ?? b.user;
      if (key && !bookingMap[key]) {
        bookingMap[key] = b;
      }
    });

    // sort by latest activity: latest booking createdAt desc, fallback to user createdAt desc
    const sortedUsers = [...users].sort((a, b) => {
      const ba = bookingMap[a._id?.toString?.() ?? a._id];
      const bb = bookingMap[b._id?.toString?.() ?? b._id];
      const ta = ba?.createdAt ? new Date(ba.createdAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const tb = bb?.createdAt ? new Date(bb.createdAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return tb - ta;
    });

    const data = sortedUsers.map((u) => {
      const b = bookingMap[u._id?.toString?.() ?? u._id];

      return {
        id: u._id.toString(),
        name: `${(u.firstName || "").trim()} ${(u.lastName || "").trim()}`.trim() || "Guest",
        email: u.email || "",
        phoneNumber: u.phoneNumber || "",

        adults: b?.adults || 0,
        children: b?.children || 0,
        familyMembers: (b?.adults || 0) + (b?.children || 0),

        status: b
          ? b.paymentStatus === "pending"
            ? "PENDING"
            : b.isCheckedIn && !b.isCheckedOut
            ? "CHECKED_IN"
            : b.isCheckedOut
            ? "CHECKED_OUT"
            : "BOOKED"
          : "NO_BOOKING"
      };
    });

    const total = await User.countDocuments(userFilter);

    res.json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      data
    });
  } catch (error) {
    console.error("❌ Admin Guest List Error:", error);
    next(error);
  }
};


export const getGuestDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      user: id,
      bookingStatus: { $in: ["confirmed", "pending"] },
    })
      .sort({ createdAt: -1 })
      .populate("room", "name roomNumber")
      .lean();

    if (!booking) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: {
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        adults: booking.adults,
        children: booking.children,
        totalGuests: booking.adults + booking.children,
        room: booking.room
          ? `${booking.room.roomNumber} • ${booking.room.name}`
          : "Room Not Found"
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getGuestTransactions = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      user: id,
      bookingStatus: { $in: ["confirmed", "pending"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!booking) {
      return res.json({
        success: true,
        data: null
      });
    }

    const transactions = await Transaction.find({
      booking: booking._id,
      status: "SUCCESS"
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        pendingAmount: booking.pendingAmount,
        paymentType: booking.paymentType,
        paymentStatus: booking.paymentStatus,
        transactions: transactions.map(t => ({
          amount: t.paidAmount,
          mode: t.type.includes("OFFLINE") ? "Cash" : "Online",
          transactionId: t.razorpayPaymentId || "OFFLINE",
          date: t.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getGuestBookingHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ user: id })
      .sort({ createdAt: -1 })
      .populate("room", "name roomNumber")
      .lean();

    const data = bookings.map((b) => ({
      id: b._id.toString(),
      bookingReference: b.guestId || b._id.toString().slice(-6).toUpperCase(),
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
      createdAt: b.createdAt,
      room: b.room ? `${b.room.roomNumber} • ${b.room.name}` : "Room Not Found",
      bookingStatus: b.bookingStatus,
      paymentStatus: b.paymentStatus,
      totalAmount: b.totalAmount || 0,
      paidAmount: b.paidAmount || 0,
      pendingAmount: b.pendingAmount || 0,
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const exportGuestsToSheet = async (req, res, next) => {
  try {
    const guests = await User.find().lean();

    if (!Array.isArray(guests)) {
      return res.status(500).json({
        success: false,
        message: "Guest data is not an array"
      });
    }

    await exportGuestsToSheet(guests);

    res.json({
      success: true,
      message: "Guests exported to Google Sheet"
    });
  } catch (error) {
    next(error);
  }
};

export const getGuestPaymentSummary = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ user: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    if (!booking) {
      return res.json({ success: true, data: null });
    }

    res.json({
      success: true,
      data: {
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        pendingAmount: booking.pendingAmount,
        paymentStatus: booking.paymentStatus
      }
    });
  } catch (error) {
    next(error);
  }
};
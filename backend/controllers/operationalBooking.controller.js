// import Booking from "../models/Booking.model.js";

// export const getReceptionistBookingStats = async (req, res, next) => {
//   try {
//     const today = new Date();
//     today.setHours(0,0,0,0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     const myBookingsToday = await Booking.countDocuments({
//       createdAt: { $gte: today, $lt: tomorrow }
//     });

//     const pendingArrivals = await Booking.countDocuments({
//       bookingStatus: "confirmed",
//       isCheckedIn: false,
//       checkInDate: { $gte: today, $lt: tomorrow }
//     });

//     const completedCheckOuts = await Booking.countDocuments({
//       isCheckedOut: true,
//       checkOutDate: { $gte: today, $lt: tomorrow }
//     });

//     res.json({
//       success: true,
//       myBookingsToday,
//       pendingArrivals,
//       completedCheckOuts
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// export const getReceptionistBookings = async (req, res, next) => {
//   try {
//     const { status, date } = req.query;

//     const filter = {};

//     if (status) {
//       filter.bookingStatus = status;
//     }

//     if (date) {
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);

//       const end = new Date(start);
//       end.setDate(start.getDate() + 1);

//       filter.createdAt = { $gte: start, $lt: end };
//     }

//     const bookings = await Booking.find(filter)
//       .populate("user", "firstName lastName")
//       .populate("room", "roomNumber name")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: bookings
//     });
//   } catch (error) {
//     next(error);
//   }
// };


import Booking from "../models/Booking.model.js";

/* ===================== STATS ===================== */
export const getReceptionistBookingStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const myBookingsToday = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const pendingArrivals = await Booking.countDocuments({
      bookingStatus: "confirmed",
      isCheckedIn: false
    });

    const completedCheckOuts = await Booking.countDocuments({
      isCheckedOut: true
    });

    res.json({
      success: true,
      myBookingsToday,
      pendingArrivals,
      completedCheckOuts
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== BOOKINGS LIST ===================== */
/* ===================== BOOKINGS LIST ===================== */
export const getReceptionistBookings = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    /* ---------- STATUS FILTER (FRONTEND MATCH) ---------- */
    if (status) {
      switch (status) {
        case "check-in":
          filter.bookingStatus = "confirmed";
          filter.isCheckedIn = true;
          filter.isCheckedOut = false;
          break;

        case "pending":
          filter.bookingStatus = "confirmed";
          filter.isCheckedIn = false;
          break;

        case "check-out":
          filter.isCheckedOut = true;
          break;

        case "cancelled":
          filter.bookingStatus = "cancelled";
          break;

        default:
          break;
      }
    }

    /* ---------- DATE FILTER (ACTIVE STAY LOGIC) ---------- */
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      filter.checkInDate = { $lte: end };
      filter.checkOutDate = { $gte: start };
    }

    const bookings = await Booking.find(filter)
      .populate("user", "firstName lastName")
      .populate("rooms.room", "roomNumber name")
      .sort({ checkInDate: 1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};
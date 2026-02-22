import Booking from "../models/Booking.model.js";
import Room from "../models/Room.model.js";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
export const getReceptionistOverview = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const totalRooms = await Room.countDocuments();

    const occupiedRooms = await Booking.countDocuments({
      bookingStatus: "confirmed",
      checkInDate: { $lte: tomorrow },
      checkOutDate: { $gt: today },
    });

    const occupancy =
      totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);

    res.json({
      success: true,
      occupancy,
      expectedCheckIns: await Booking.countDocuments({
        checkInDate: { $gte: today, $lt: tomorrow },
        bookingStatus: "confirmed",
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const checkIns = await Booking.countDocuments({
      checkInDate: { $gte: today, $lt: tomorrow },
      bookingStatus: "confirmed",
    });

    const checkOuts = await Booking.countDocuments({
      checkOutDate: { $gte: today, $lt: tomorrow },
      bookingStatus: "confirmed",
    });

    const availableRooms = await Room.countDocuments({
      status: "Available",
    });

    const pendingPayments = await Booking.countDocuments({
      paymentStatus: "pending",
    });

    const revenueAgg = await Transaction.aggregate([
      {
        $match: {
          status: "SUCCESS",
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paidAmount" },
        },
      },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      checkIns,
      checkOuts,
      availableRooms,
      pendingPayments,
      revenue,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyBookingTrends = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6); // Last 7 days

    // Get bookings for last 7 days
    const trends = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);

      const nextDay = new Date(currentDay);
      nextDay.setDate(currentDay.getDate() + 1);

      const count = await Booking.countDocuments({
        checkInDate: {
          $gte: currentDay,
          $lt: nextDay,
        },
      });

      trends.push({
        day: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
        date: currentDay.toISOString().split("T")[0],
        count: count,
        occupancy: count, // Alias for flexibility
      });
    }

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error("Weekly trends error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      bookingStatus: "confirmed",
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate("rooms.room", "name roomNumber")
      .populate("user", "firstName lastName");

    const activities = bookings.map((b) => {
      const firstName = b?.user?.firstName || "";
      const lastName = b?.user?.lastName || "";
      const guestName = `${firstName} ${lastName}`.trim() || "Guest";
      const roomName = b?.room?.name || "";
      const roomNumber = b?.room?.roomNumber || "";
      const roomLabel = `${roomName} ${roomNumber}`.trim() || "Room";
      return {
        type: b.isCheckedOut
          ? "CHECK_OUT"
          : b.isCheckedIn
            ? "CHECK_IN"
            : "BOOKING",
        guest: guestName,
        room: roomLabel,
        time: b.updatedAt || b.createdAt,
      };
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestBookings = async (req, res, next) => {
  try {
    // Include both confirmed and pending - filter by paymentStatus for Pending/Confirmed
    const bookings = await Booking.find({
      bookingStatus: { $in: ["confirmed", "pending"] },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "firstName lastName")
      .populate("rooms.room", "roomNumber name");

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getGuestDirectory = async (req, res, next) => {
  try {
    const { search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const guests = await User.find(filter)
      .select("firstName lastName email phoneNumber createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  } catch (error) {
    next(error);
  }
};

export const getGuestDetails = async (req, res, next) => {
  try {
    const { guestId } = req.params;

    const guest = await User.findById(guestId);
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    const bookings = await Booking.find({
      user: guest._id,
      bookingStatus: { $in: ["confirmed", "cancelled"] },
    })
      .populate("rooms.room", "name roomNumber")
      .sort({ checkInDate: -1 });

    const totalVisits = bookings.length;
    const lifetimeSpend = bookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        guest: {
          name: `${guest.firstName} ${guest.lastName}`,
          email: guest.email,
          phoneNumber: guest.phoneNumber,
          memberSince: guest.createdAt,
        },
        stats: {
          totalVisits,
          lifetimeSpend,
        },
        stayHistory: bookings.map((b) => ({
          bookingId: b._id,
          room: b.room?.name,
          roomNumber: b.room?.roomNumber,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          amount: b.totalAmount,
          status: b.bookingStatus,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInHouseGuests = async (req, res, next) => {
  try {
    const today = new Date();

    const bookings = await Booking.find({
      bookingStatus: "confirmed",
      checkInDate: { $lte: today },
      checkOutDate: { $gt: today },
    })
      .populate("user", "firstName lastName email")
      .populate("rooms.room", "roomNumber name");

    res.json({
      success: true,
      count: bookings.length,
      data: bookings.map((b) => ({
        guest: b.user,
        room: b.room,
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Update Booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, room, type, date, price, checkInDate, checkOutDate, totalAmount } = req.body;

    const booking = await Booking.findById(id).populate("user room");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (name) {
      const [firstName, ...lastNameArr] = name.split(" ");
      await User.findByIdAndUpdate(booking.user._id, {
        firstName: firstName || booking.user?.firstName,
        lastName: lastNameArr.join(" ") || booking.user?.lastName,
      });
    }

    if (room != null && room !== "") {
      const rn = String(room).trim();
      const roomDoc = await Room.findOne({
        $or: [{ roomNumber: rn }, { roomNumber: Number(rn) }],
      });
      if (roomDoc) booking.room = roomDoc._id;
    }

    if (checkInDate) booking.checkInDate = new Date(checkInDate);
    else if (date) booking.checkInDate = new Date(date);
    if (checkOutDate) booking.checkOutDate = new Date(checkOutDate);
    const amount = totalAmount ?? price;
    if (amount != null && !isNaN(Number(amount))) booking.totalAmount = Number(amount);

    await booking.save();
    await booking.populate("user rooms.room");

    res.json({
      success: true,
      data: booking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const roomId = booking.room;

    await booking.deleteOne();

    if (roomId) {
      const room = await Room.findById(roomId);
      if (room && room.status !== "Available") {
        room.status = "Available";
        await room.save();
      }
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

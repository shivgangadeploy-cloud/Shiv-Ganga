// import Booking from "../models/Booking.model.js";
// import Receptionist from "../models/Receptionist.model.js";
// import Room from "../models/Room.model.js";
// import User from "../models/User.model.js";
// import { exportBookingsToSheet } from "../services/googleSheet.service.js";
// export const getTotalBookings = async (req, res) => {
//   const total = await Booking.countDocuments({
//     bookingStatus: "confirmed"
//   });

//   res.json({
//     success: true,
//     totalBookings: total
//   });
// };


// export const getTodaysCheckIns = async (req, res) => {
//   const today = new Date();
//   today.setHours(0,0,0,0);

//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const count = await Booking.countDocuments({
//     checkInDate: { $gte: today, $lt: tomorrow },
//     bookingStatus: "confirmed"
//   });

//   res.json({
//     success: true,
//     todaysCheckIns: count
//   });
// };

// export const getOccupancy = async (req, res) => {
//   const today = new Date();
//   today.setHours(0,0,0,0);

//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const totalRooms = await Room.countDocuments();

//   const occupiedRooms = await Booking.countDocuments({
//     bookingStatus: "confirmed",
//     checkInDate: { $lte: tomorrow },
//     checkOutDate: { $gt: today }
//   });

//   const occupancy =
//     totalRooms === 0
//       ? 0
//       : Math.round((occupiedRooms / totalRooms) * 100);

//   res.json({
//     success: true,
//     occupancy,
//     occupiedRooms,
//     totalRooms
//   });
// };



// export const getTotalRevenue = async (req, res) => {
//   const revenue = await Booking.aggregate([
//     {
//       $match: { paymentStatus: "paid" }
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$totalAmount" }
//       }
//     }
//   ]);

//   res.json({
//     success: true,
//     totalRevenue: revenue[0]?.total || 0
//   });
// };


// export const getMonthlyRevenue = async (req, res) => {
//   const monthlyData = await Booking.aggregate([
//     {
//       $match: { paymentStatus: "paid" }
//     },
//     {
//       $group: {
//         _id: { $month: "$createdAt" },
//         revenue: { $sum: "$totalAmount" }
//       }
//     }
//   ]);

  
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

  
//   const formattedData = months.map((month, index) => {
//     const found = monthlyData.find(m => m._id === index + 1);
//     return {
//       month,
//       revenue: found ? found.revenue : 0
//     };
//   });

//   res.json({
//     success: true,
//     data: formattedData
//   });
// };



// export const getOccupancyTrends = async (req, res) => {
//   const rawData = await Booking.aggregate([
//     {
//       $match: { bookingStatus: "confirmed" }
//     },
//     {
//       $group: {
//         _id: { $dayOfWeek: "$createdAt" },
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   const days = [
//     "Sunday", "Monday", "Tuesday",
//     "Wednesday", "Thursday", "Friday", "Saturday"
//   ];

//   const formattedData = days.map((day, index) => {
//     const found = rawData.find(d => d._id === index + 1);
//     return {
//       day,
//       count: found ? found.count : 0
//     };
//   });

//   res.json({
//     success: true,
//     data: formattedData
//   });
// };


// export const getRecentActivities = async (req, res) => {
//   const bookings = await Booking.find({ bookingStatus: "confirmed" })
//     .sort({ updatedAt: -1 })
//     .limit(10)
//     .populate("room", "name roomNumber")
//     .populate("user", "firstName lastName");

//   let activities = [];

//   bookings.forEach(b => {
//     const base = {
//       room: `${b.room.name} · Room ${b.room.roomNumber}`,
//       user: `${b.user.firstName} ${b.user.lastName}`
//     };

   
//     activities.push({
//       type: "BOOKING",
//       title: "New Booking",
//       description: base.room,
//       user: base.user,
//       icon: "booking",
//       createdAt: b.createdAt
//     });

//     // ✅ Guest Checked In
//     if (b.isCheckedIn) {
//       activities.push({
//         type: "CHECK_IN",
//         title: "Guest Checked In",
//         description: base.room,
//         user: base.user,
//         icon: "checkin",
//         createdAt: b.checkedInAt
//       });
//     }

//     // 🚪 Guest Checked Out
//     if (b.isCheckedOut) {
//       activities.push({
//         type: "CHECK_OUT",
//         title: "Guest Checked Out",
//         description: base.room,
//         user: base.user,
//         icon: "checkout",
//         createdAt: b.checkedOutAt
//       });
//     }
//   });

//   // Latest activity first
//   activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   res.json({
//     success: true,
//     activities: activities.slice(0, 10)
//   });
// };


// export const exportBookings = async (req, res, next) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user")
//       .populate("room");

//     await exportBookingsToSheet(bookings);

//     res.json({
//       success: true,
//       message: "Bookings exported to Google Sheet"
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// export const getReceptionistStatus = async (req, res) => {
//   const receptionists = await Receptionist.find({ role: "receptionist" })
//     .select("firstName lastName email employeeId isActive createdAt")
//     .sort({ createdAt: -1 });

//   const formatted = receptionists.map(r => ({
//     name: `${r.firstName} ${r.lastName}`,
//     employeeId: r.employeeId,
//     email: r.email,
//     status: r.isActive ? "Active" : "Inactive",
//     isActive: r.isActive
//   }));

//   res.json({
//     success: true,
//     total: formatted.length,
//     active: formatted.filter(r => r.isActive).length,
//     inactive: formatted.filter(r => !r.isActive).length,
//     data: formatted
//   });
// };


// export const getRoomStatusSummary = async (req, res) => {
//   try {
//     const totalRooms = await Room.countDocuments();

//     const availableRooms = await Room.countDocuments({
//       status: "Available"
//     });

//     const bookedRooms = await Room.countDocuments({
//       status: "Booked"
//     });

//     const occupiedRooms = await Room.countDocuments({
//       status: "Occupied"
//     });

//     const maintenanceRooms = await Room.countDocuments({
//       status: "Maintenance"
//     });

//     res.json({
//       success: true,
//       data: {
//         totalRooms,
//         availableRooms,
//         bookedRooms,
//         occupiedRooms,
//         maintenanceRooms
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch room status summary"
//     });
//   }
// };

// export const getGuestsToday = async (req, res, next) => {
//   try {
//     const today = new Date();
//     today.setHours(0,0,0,0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     const bookings = await Booking.find({
//       bookingStatus: "confirmed",
//       checkInDate: { $gte: today, $lt: tomorrow }
//     }).select("adults children");

//     const totalGuests = bookings.reduce(
//       (sum, b) => sum + (b.adults || 0) + (b.children || 0),
//       0
//     );

//     res.json({
//       success: true,
//       guestsToday: totalGuests
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// export const getAverageStay = async (req, res, next) => {
//   try {
//     const bookings = await Booking.find({
//       bookingStatus: "confirmed"
//     }).select("checkInDate checkOutDate");

//     if (!bookings.length) {
//       return res.json({ success: true, averageStay: 0 });
//     }

//     const totalNights = bookings.reduce((sum, b) => {
//       const nights =
//         (new Date(b.checkOutDate) - new Date(b.checkInDate)) /
//         (1000 * 60 * 60 * 24);
//       return sum + nights;
//     }, 0);

//     const avgStay = (totalNights / bookings.length).toFixed(1);

//     res.json({
//       success: true,
//       averageStay: Number(avgStay)
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// export const getWeeklyRoomUtilization = async (req, res, next) => {
//   try {
//     const totalRooms = await Room.countDocuments();
//     const today = new Date();
//     today.setHours(0,0,0,0);

//     const result = [];

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(today.getDate() - i);

//       const nextDay = new Date(date);
//       nextDay.setDate(date.getDate() + 1);

//       const occupied = await Booking.countDocuments({
//         bookingStatus: "confirmed",
//         checkInDate: { $lt: nextDay },
//         checkOutDate: { $gt: date }
//       });

//       const percentage =
//         totalRooms === 0
//           ? 0
//           : Math.round((occupied / totalRooms) * 100);

//       result.push({
//         date,
//         occupied,
//         totalRooms,
//         percentage
//       });
//     }

//     res.json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// export const getTopPerformingRooms = async (req, res, next) => {
//   try {
//     const limit = Number(req.query.limit) || 5;
//     const totalRooms = await Room.countDocuments();

//     const data = await Booking.aggregate([
//       { $match: { bookingStatus: "confirmed" } },
//       {
//         $group: {
//           _id: "$room",
//           revenue: { $sum: "$totalAmount" },
//           bookings: { $sum: 1 }
//         }
//       },
//       { $sort: { revenue: -1 } },
//       { $limit: limit },
//       {
//         $lookup: {
//           from: "rooms",
//           localField: "_id",
//           foreignField: "_id",
//           as: "room"
//         }
//       },
//       { $unwind: "$room" }
//     ]);

//     const formatted = data.map(r => ({
//       roomName: r.room.name,
//       revenue: r.revenue,
//       occupancy:
//         totalRooms === 0
//           ? 0
//           : Math.round((r.bookings / totalRooms) * 100)
//     }));

//     res.json({
//       success: true,
//       data: formatted
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAdminRecentBookings = async (req, res, next) => {
//   try {
//     const bookings = await Booking.find()
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .populate("user", "firstName lastName")
//       .populate("room", "name");

//     const formatted = bookings.map(b => ({
//       bookingId: b.guestId,         
//       guest: `${b.user.firstName} ${b.user.lastName}`,
//       room: b.room.name,
//       amount: b.totalAmount,
//       status: b.paymentStatus || b.bookingStatus
//     }));

//     res.json({
//       success: true,
//       data: formatted
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// export const getAllBookingsForAdmin = async (req, res, next) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       status,
//       paymentStatus
//     } = req.query;

//     const filter = {};

//     if (status) {
//       filter.bookingStatus = status;
//     }

//     if (paymentStatus) {
//       filter.paymentStatus = paymentStatus;
//     }

//     const bookings = await Booking.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .populate("user", "firstName lastName email phoneNumber id idDocument")
//       .populate("room", "name roomNumber category")
//       .lean();

//     const total = await Booking.countDocuments(filter);

//     const formatted = bookings.map(b => ({
//       bookingId: b.guestId,
//       guest: b.user
//         ? `${b.user.firstName} ${b.user.lastName}`
//         : "Unknown Guest",
//       guestIdNumber: b.user?.id || null,
//       room: b.room
//         ? `${b.room.name} (Room ${b.room.roomNumber})`
//         : "Room Not Found",
//       checkInDate: b.checkInDate,
//       checkOutDate: b.checkOutDate,
//       amount: b.totalAmount,
//       paidAmount: b.paidAmount,
//       pendingAmount: b.pendingAmount,
//       bookingStatus: b.bookingStatus,
//       paymentStatus: b.paymentStatus,
//       paymentType: b.paymentType,
//       createdAt: b.createdAt
//     }));

//     res.json({
//       success: true,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       totalRecords: total,
//       data: formatted
//     });
//   } catch (error) {
//     next(error);
//   }
// };


import Booking from "../models/Booking.model.js";
import Receptionist from "../models/Receptionist.model.js";
import Room from "../models/Room.model.js";
import User from "../models/User.model.js";
import { exportBookingsToSheet } from "../services/googleSheet.service.js";

export const getTotalBookings = async (req, res) => {
  try {
    const total = await Booking.countDocuments({
      bookingStatus: "confirmed",
    });

    res.json({
      success: true,
      totalBookings: total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch total bookings",
    });
  }
};

export const getTodaysCheckIns = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const count = await Booking.countDocuments({
    checkInDate: { $gte: today, $lt: tomorrow },
    bookingStatus: "confirmed",
  });

  res.json({
    success: true,
    todaysCheckIns: count,
  });
};
export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "firstName lastName email")
      .populate("room", "roomNumber name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};
export const getOccupancy = async (req, res) => {
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
    occupiedRooms,
    totalRooms,
  });
};

export const getTotalRevenue = async (req, res) => {
  const revenue = await Booking.aggregate([
    {
      $match: { paymentStatus: "paid" },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  res.json({
    success: true,
    totalRevenue: revenue[0]?.total || 0,
  });
};

export const getMonthlyRevenue = async (req, res) => {
  const monthlyData = await Booking.aggregate([
    {
      $match: { paymentStatus: "paid" },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedData = months.map((month, index) => {
    const found = monthlyData.find((m) => m._id === index + 1);
    return {
      month,
      revenue: found ? found.revenue : 0,
    };
  });

  res.json({
    success: true,
    data: formattedData,
  });
};

export const getOccupancyTrends = async (req, res) => {
  const rawData = await Booking.aggregate([
    {
      $match: { bookingStatus: "confirmed" },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$checkInDate" },
        count: { $sum: 1 },
      },
    },
  ]);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formattedData = days.map((day, index) => {
    const found = rawData.find((d) => d._id === index + 1);
    return {
      day,
      count: found ? found.count : 0,
    };
  });

  res.json({
    success: true,
    data: formattedData,
  });
};

export const getRecentActivities = async (req, res) => {
  const bookings = await Booking.find({ bookingStatus: "confirmed" })
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate("room", "name roomNumber")
    .populate("user", "firstName lastName");

  let activities = [];

  bookings.forEach((b) => {
    const base = {
      room: `${b.room.name} · Room ${b.room.roomNumber}`,
      user: `${b.user.firstName} ${b.user.lastName}`,
    };

    // 🆕 Booking Created
    activities.push({
      type: "BOOKING",
      title: "New Booking",
      description: base.room,
      user: base.user,
      amount: b.totalAmount,
      createdAt: b.createdAt,
    });

    // ✅ Guest Checked In
    if (b.isCheckedIn) {
      activities.push({
        type: "CHECK_IN",
        title: "Guest Checked In",
        description: base.room,
        user: base.user,
        icon: "checkin",
        createdAt: b.checkedInAt,
      });
    }

    // 🚪 Guest Checked Out
    if (b.isCheckedOut) {
      activities.push({
        type: "CHECK_OUT",
        title: "Guest Checked Out",
        description: base.room,
        user: base.user,
        icon: "checkout",
        createdAt: b.checkedOutAt,
      });
    }
  });

  // Latest activity first
  activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    activities: activities.slice(0, 10),
  });
};

export const exportBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("user").populate("room");

    await exportBookingsToSheet(bookings);

    res.json({
      success: true,
      message: "Bookings exported to Google Sheet",
    });
  } catch (error) {
    next(error);
  }
};

export const getReceptionistStatus = async (req, res) => {
  const receptionists = await Receptionist.find({ role: "receptionist" })
    .select("firstName lastName email employeeId isActive createdAt")
    .sort({ createdAt: -1 });

  const formatted = receptionists.map((r) => ({
    name: `${r.firstName} ${r.lastName}`,
    employeeId: r.employeeId,
    email: r.email,
    status: r.isActive ? "Active" : "Inactive",
    isActive: r.isActive,
  }));

  res.json({
    success: true,
    total: formatted.length,
    active: formatted.filter((r) => r.isActive).length,
    inactive: formatted.filter((r) => !r.isActive).length,
    data: formatted,
  });
};

export const getRoomStatusSummary = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();

    const availableRooms = await Room.countDocuments({
      status: "Available",
    });

    const bookedRooms = await Room.countDocuments({
      status: "Booked",
    });

    const occupiedRooms = await Room.countDocuments({
      status: "Occupied",
    });

    const maintenanceRooms = await Room.countDocuments({
      status: "Maintenance",
    });

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        bookedRooms,
        occupiedRooms,
        maintenanceRooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch room status summary",
    });
  }
};
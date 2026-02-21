import Room from "../models/Room.model.js";
import Booking from "../models/Booking.model.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import BookingPolicy from "../models/BookingPolicy.model.js";
import mongoose from "mongoose";

export const createRoom = async (req, res, next) => {
  try {
    const {
      roomNumber,
      name,
      type,
      category,
      description,
      roomSize,
      features,
      status,
      checkInTime,
      checkOutTime,
    } = req.body;

    const pricePerNight = Number(req.body.pricePerNight);
    const capacityAdults = Number(req.body.capacityAdults);
    const capacityChildren = Number(req.body.capacityChildren);

    const policy = await BookingPolicy.findOne({ isActive: true });

    if (!policy) {
      return res.status(400).json({
        success: false,
        message: "Booking policy not configured",
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room number already exists",
      });
    }

    if (!req.files?.mainImage) {
      return res.status(400).json({
        success: false,
        message: "Main room image is required",
      });
    }

    const mainImageUpload = await uploadToCloudinary(
      req.files.mainImage[0],
      "hotel/rooms/main",
    );

    let gallery = [];
    if (req.files?.gallery) {
      for (const file of req.files.gallery) {
        const upload = await uploadToCloudinary(file, "hotel/rooms/gallery");
        gallery.push(upload.secure_url);
      }
    }

    const room = await Room.create({
      roomNumber,
      name,
      type,
      category,
      description,
      pricePerNight: Number(pricePerNight),
      roomSize,
      capacityAdults: Number(capacityAdults),
      capacityChildren: Number(capacityChildren),
      features: Array.isArray(features) ? features : features ? [features] : [],
      status: status || "Available",
      mainImage: mainImageUpload.secure_url,
      gallery,
      createdBy: req.user._id,
      checkInTime: checkInTime || policy.checkInTime,
      checkOutTime: checkOutTime || policy.checkOutTime,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (req.files?.mainImage) {
      const upload = await uploadToCloudinary(
        req.files.mainImage[0],
        "hotel/rooms/main",
      );
      room.mainImage = upload.secure_url;
    }

    if (req.files?.gallery) {
      const galleryUrls = [];
      for (const file of req.files.gallery) {
        const upload = await uploadToCloudinary(file, "hotel/rooms/gallery");
        galleryUrls.push(upload.secure_url);
      }
      room.gallery = galleryUrls;
    }

    const allowedFields = [
      "roomNumber",
      "name",
      "type",
      "category",
      "description",
      "pricePerNight",
      "roomSize",
      "capacityAdults",
      "capacityChildren",
      "features",
      "status",
      "checkInTime",
      "checkOutTime",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (
          field === "pricePerNight" ||
          field === "capacityAdults" ||
          field === "capacityChildren"
        ) {
          room[field] = Number(req.body[field]);
        } else {
          room[field] = req.body[field];
        }
      }
    });

    await room.save();

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    // Get date from query, or default to now
    const viewDate = req.query.date ? new Date(req.query.date) : new Date();

    // normalize to full-day window
    const startOfDay = new Date(viewDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(viewDate);
    endOfDay.setHours(23, 59, 59, 999);

    const rooms = await Room.aggregate([
      {
        $lookup: {
          from: "bookings",
          let: { roomId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$room", "$$roomId"] },
                    { $eq: ["$bookingStatus", "confirmed"] },
                    { $lte: ["$checkInDate", endOfDay] },
                    { $gt: ["$checkOutDate", startOfDay] },
                    {
                      $or: [
                        { $eq: ["$isCheckedOut", false] },
                        { $not: ["$isCheckedOut"] }, // handles missing field
                      ],
                    },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "activeBooking",
        },
      },

      {
        $addFields: {
          activeBooking: { $arrayElemAt: ["$activeBooking", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "activeBooking.user",
          foreignField: "_id",
          as: "activeBookingUser",
        },
      },
      {
        $addFields: {
          "activeBooking.guestName": {
            $cond: [
              { $gt: [{ $size: "$activeBookingUser" }, 0] },
              {
                $trim: {
                  input: {
                    $concat: [
                      { $ifNull: [{ $arrayElemAt: ["$activeBookingUser.firstName", 0] }, ""] },
                      " ",
                      { $ifNull: [{ $arrayElemAt: ["$activeBookingUser.lastName", 0] }, ""] },
                    ],
                  },
                },
              },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          derivedStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "Maintenance"] },
                  then: "Maintenance",
                },
                {
                  case: {
                    $and: [
                      { $ne: ["$activeBooking", null] },
                      { $ifNull: ["$activeBooking._id", false] }
                    ]
                  },
                  then: {
                    $cond: [
                      { $eq: ["$activeBooking.isCheckedIn", true] },
                      "Occupied",
                      "Booked"
                    ]
                  }
                }
              ],
              default: "Available"
            }
          }
        }
      },
      {
        $addFields: {
          bookingDetails: {
            $cond: [
              { $ne: ["$activeBooking", null] },
              {
                checkInDate: "$activeBooking.checkInDate",
                checkOutDate: "$activeBooking.checkOutDate",
              },
              null
            ]
          }
        }
      }
    ]);

    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room id",
      });
    }

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate, adults, children } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "checkInDate and checkOutDate are required",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });
    }

    const roomFilters = {
      status: { $ne: "Maintenance" },
    };

    const adultsNum = Number(adults);
    const childrenNum = Number(children);
    if (adults !== undefined && adults !== "" && !Number.isNaN(adultsNum) && adultsNum > 0) {
      roomFilters.capacityAdults = { $gte: adultsNum };
    }
    if (children !== undefined && children !== "" && !Number.isNaN(childrenNum) && childrenNum >= 0) {
      roomFilters.capacityChildren = { $gte: childrenNum };
    }

    const bookedRoomIds = await Booking.find({
      bookingStatus: "confirmed",
      isCheckedOut: { $ne: true },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    }).distinct("room");

    if (bookedRoomIds.length > 0) {
      roomFilters._id = { $nin: bookedRoomIds };
    }

    const rooms = await Room.find(roomFilters).sort({ pricePerNight: 1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableRoomsForListing = async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate } = req.body;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide check-in and check-out dates",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const rooms = await Room.aggregate([
      {
        $match: {
          status: { $ne: "Maintenance" },
        },
      },
      {
        $lookup: {
          from: "bookings",
          let: { roomId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$room", "$$roomId"] },
                    { $eq: ["$bookingStatus", "confirmed"] },
                    { $ne: ["$isCheckedOut", true] },

                    // 🔥 OVERLAP CHECK
                    { $lt: ["$checkInDate", checkOut] },
                    { $gt: ["$checkOutDate", checkIn] },
                  ],
                },
              },
            },
          ],
          as: "overlappingBookings",
        },
      },

      // Keep rooms with ZERO overlapping bookings
      {
        $match: {
          overlappingBookings: { $size: 0 },
        },
      },

      {
        $sort: { pricePerNight: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};
import Testimonial from "../models/Testimonial.model.js";
import Booking from "../models/Booking.model.js";
import Room from "../models/Room.model.js";


export const createTestimonial = async (req, res, next) => {
  try {
    const { bookingId, rating, message } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("rooms.room")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.bookingStatus !== "confirmed" || booking.paymentStatus !== "paid") {
      return res.status(403).json({
        success: false,
        message: "Only completed bookings can be reviewed"
      });
    }

    const alreadyReviewed = await Testimonial.findOne({
      booking: booking._id
    });

    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "Review already submitted for this booking"
      });
    }

    const testimonial = await Testimonial.create({
      booking: booking._id,
      room: booking.room._id,
      name: `${booking.user.firstName} ${booking.user.lastName}`,
      email: booking.user.email,
      rating,
      message
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback. Awaiting approval.",
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};


export const getApprovedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .populate("room", "name");

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};


export const approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    if (testimonial.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Testimonial already approved"
      });
    }

    testimonial.isApproved = true;
    await testimonial.save();

    
    const approvedTestimonials = await Testimonial.find({
      room: testimonial.room,
      isApproved: true
    });

    const totalRatings = approvedTestimonials.reduce(
      (sum, t) => sum + t.rating,
      0
    );

    const averageRating =
      approvedTestimonials.length === 0
        ? 0
        : Number((totalRatings / approvedTestimonials.length).toFixed(1));

    await Room.findByIdAndUpdate(testimonial.room, {
      ratings: {
        average: averageRating,
        count: approvedTestimonials.length
      }
    });

    res.status(200).json({
      success: true,
      message: "Testimonial approved and room rating updated"
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialsByRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const testimonials = await Testimonial.find({
      room: roomId,
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .populate("room", "name");

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};


export const getBookingForReview = async (req, res, next) => {
  try {
    const { roomId, email } = req.query;

    const booking = await Booking.findOne({
      room: roomId,
      bookingStatus: "confirmed",
      paymentStatus: "paid"
    }).populate("user");

    if (!booking || booking.user.email !== email) {
      return res.status(404).json({
        success: false,
        message: "No eligible booking found for this email"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id
      }
    });
  } catch (error) {
    next(error);
  }
};


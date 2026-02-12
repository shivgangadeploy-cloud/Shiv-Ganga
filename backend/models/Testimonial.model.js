import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true 
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    message: {
      type: String,
      required: true,
      maxlength: 500
    },

    isApproved: {
      type: Boolean,
      default: false 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);

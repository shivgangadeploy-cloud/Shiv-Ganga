import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["receptionist", "admin"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    message: {
      type: String,
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);

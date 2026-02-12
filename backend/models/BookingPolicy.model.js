import mongoose from "mongoose";

const bookingPolicySchema = new mongoose.Schema(
  {
    checkInTime: {
      type: String,
      required: true
    },
    checkOutTime: {
      type: String,
      required: true
    },
    earlyCheckInFee: {
      type: Number,
      default: 0
    },
    cancellationWindowHours: {
      type: Number,
      default: 24
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("BookingPolicy", bookingPolicySchema);

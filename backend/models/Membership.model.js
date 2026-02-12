import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Hotel Membership",
      trim: true
    },

    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Membership", membershipSchema);

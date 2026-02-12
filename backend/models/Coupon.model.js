import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },

    isActive: {
      type: Boolean,
      default: true
    },

    startDate: {
      type: Date,
      default: null 
    },

    expiryDate: {
      type: Date,
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },
    usageLimit: {
  type: Number,
  default: null 
},
usageCount: {
  type: Number,
  default: 0
}

  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);

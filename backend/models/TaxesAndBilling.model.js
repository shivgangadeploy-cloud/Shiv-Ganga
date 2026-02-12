import mongoose from "mongoose";

const taxesAndBillingSchema = new mongoose.Schema(
  {
    gstPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 12
    },

    extraBedPricePerNight: {
      type: Number,
      required: true,
      min: 0,
      default: 1200
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "TaxesAndBilling",
  taxesAndBillingSchema
);

import mongoose from "mongoose";

const staffTransactionSchema = new mongoose.Schema(
  {
    receptionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receptionist",
      required: true
    },

    salary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffSalary",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    method: {
      type: String,
      enum: ["BANK_TRANSFER", "UPI", "CASH"],
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "MANUAL"],
      default: "RAZORPAY"
    },

    razorpayPayoutId: {
      type: String
    },

    razorpayFundAccountId: {
      type: String
    },

    razorpayResponse: {
      type: Object
    },

    failureReason: {
      type: String
    }
  },
  { timestamps: true }
);

staffTransactionSchema.index(
  { salary: 1 },
  { unique: true }
);

export default mongoose.model("StaffTransaction", staffTransactionSchema);

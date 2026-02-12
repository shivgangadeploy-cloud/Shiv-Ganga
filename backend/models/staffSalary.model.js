import mongoose from "mongoose";

const staffSalarySchema = new mongoose.Schema(
  {
    receptionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receptionist",
      required: true
    },

    month: {
      type: String,
      enum: [
        "JAN","FEB","MAR","APR",
        "MAY","JUN","JUL","AUG",
        "SEP","OCT","NOV","DEC"
      ],
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    basicSalary: {
      type: Number,
      required: true
    },

    otHours: {
      type: Number,
      default: 0
    },

    otAmount: {
      type: Number,
      default: 0
    },

    bonus: {
      type: Number,
      default: 0
    },

    allowances: {
      type: Number,
      default: 0
    },

    deductions: {
      type: Number,
      default: 0
    },

    totalPayable: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["BANK_TRANSFER", "CASH", "UPI"],
      default: "BANK_TRANSFER"
    },

    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PAID"],
      default: "PENDING"
    },

    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

staffSalarySchema.index(
  { receptionist: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model("StaffSalary", staffSalarySchema);

import mongoose from "mongoose";

const loginActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    role: {
      type: String,
      enum: ["admin", "receptionist", "user"],
      required: true
    },

    ip: {
      type: String
    },

    device: {
      type: String
    },

    browser: {
      type: String
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    }
  },
  { timestamps: true }
);

export default mongoose.model("LoginActivity", loginActivitySchema);

import mongoose from "mongoose";

const receptionistSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"]
    },

    role: {
      type: String,
      enum: [
        "receptionist",
        "front_desk",
        "housekeeping",
        "kitchen",
        "security",
        "management"
      ],
      default: "receptionist"
    },

    password: {
      type: String,
      minlength: 6,
      select: false
      // ❗ required only for receptionist
    },

    employeeId: {
      type: String,
      unique: true,
      required: true
    },
basicSalary: {
  type: Number,
  required: true,
  min: 0
},

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Receptionist", receptionistSchema);

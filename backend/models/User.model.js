import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      lowercase: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },

    specialRequest: {
      type: String,
      trim: true,
      maxlength: 500
    },

    id: {
      type: String,
      trim: true
    },

    idDocument: {
      type: String, 
      trim: true
    },
    isMember: {
  type: Boolean,
  default: false
}

  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);

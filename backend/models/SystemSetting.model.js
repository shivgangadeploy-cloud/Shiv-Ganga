import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    systemHotelName: {
      type: String,
      required: true,
      trim: true
    },

    systemEmails: {
      type: [String],   
      required: true
    },

    systemPhoneNumbers: {
      type: [String],
      required: true
    },

    systemAddress: {
      type: String,
      required: true
    },

    logo: {
      type: String,
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model("SystemSetting", systemSettingSchema);

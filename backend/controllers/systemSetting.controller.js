import SystemSetting from "../models/SystemSetting.model.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

export const getSystemSettings = async (req, res, next) => {
  try {
    const settings = await SystemSetting.findOne();
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "System settings not configured yet"
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};


export const upsertSystemSettings = async (req, res, next) => {
  try {
    const {
      systemHotelName,
      systemEmails,
      systemPhoneNumbers,
      systemAddress
    } = req.body;

    let logoUrl;

    if (req.file) {
      const upload = await uploadToCloudinary(
        req.file,
        "hotel/system"
      );
      logoUrl = upload.secure_url;
    }

    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create({
        systemHotelName,
        systemEmails,
        systemPhoneNumbers,
        systemAddress,
        logo: logoUrl,
        updatedBy: req.user._id
      });
    } else {
      if (systemHotelName) settings.systemHotelName = systemHotelName;
      if (systemEmails) settings.systemEmails = systemEmails;
      if (systemPhoneNumbers) settings.systemPhoneNumbers = systemPhoneNumbers;
      if (systemAddress) settings.systemAddress = systemAddress;
      if (logoUrl) settings.logo = logoUrl;

      settings.updatedBy = req.user._id;
      await settings.save();
    }

    res.json({
      success: true,
      message: "System settings saved successfully",
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

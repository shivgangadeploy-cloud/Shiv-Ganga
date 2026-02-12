import Receptionist from "../models/Receptionist.model.js";
import LoginActivity from "../models/LoginActivity.model.js";

export const getReceptionistProfile = async (req, res, next) => {
  try {
    const receptionist = await Receptionist.findById(req.user._id).select(
  "firstName lastName email phoneNumber employeeId role bio createdAt"
);

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found"
      });
    }

  
    const loginActivity = await LoginActivity.find({
      userId: receptionist._id,
      role: "receptionist"
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("ip device browser status createdAt");

    res.status(200).json({
      success: true,
      data: {
        profile: receptionist,
        recentLogins: loginActivity
      }
    });
  } catch (error) {
    next(error);
  }
};


export const updateReceptionistProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, bio } = req.body;

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (bio !== undefined) updateData.bio = bio;

    const receptionist = await Receptionist.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true // phone regex etc apply rahega
      }
    ).select("firstName lastName phoneNumber bio");

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: receptionist
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    next(error);
  }
};


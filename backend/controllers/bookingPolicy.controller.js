import BookingPolicy from "../models/BookingPolicy.model.js";

export const getBookingPolicy = async (req, res) => {
  const policy = await BookingPolicy.findOne({ isActive: true });
  res.json({ success: true, data: policy });
};

export const upsertBookingPolicy = async (req, res) => {
  const policy = await BookingPolicy.findOneAndUpdate(
    {},
    { ...req.body, isActive: true },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    message: "Booking policy updated",
    data: policy
  });
};

export const getPublicBookingPolicy = async (req, res) => {
  try {
    const policy = await BookingPolicy.findOne({ isActive: true });
    res.json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Notification from "../models/Notification.model.js";

export const notifyReceptionistPaymentCompleted = async ({
  booking,
  user,
  room
}) => {
  await Notification.create({
    role: "receptionist",
    title: "Payment Completed",
    message: `Payment completed for Room ${room.roomNumber}.
Guest: ${user.firstName} ${user.lastName}
Mobile: ${user.phoneNumber}
Email: ${user.email}`,
    booking: booking._id
  });
};




export const notifyReceptionistCheckInOut = async ({
  type,
  booking,
  user,
  room
}) => {
  let title = "";
  let message = "";

  if (type === "CHECK_IN") {
    title = "Guest Checked In";
    message = `Guest has checked in

Guest: ${user.firstName} ${user.lastName}
Room: ${room.roomNumber}
Mobile: ${user.phoneNumber}
Email: ${user.email}`;
  }

  if (type === "CHECK_OUT") {
    title = "Guest Checked Out";
    message = `Guest has checked out

Guest: ${user.firstName} ${user.lastName}
Room: ${room.roomNumber}
Mobile: ${user.phoneNumber}
Email: ${user.email}`;
  }

  if (type === "CANCELLED") {
    title = "Booking Cancelled";
    message = `Booking cancelled by guest

Guest: ${user.firstName} ${user.lastName}
Room: ${room.roomNumber}
Mobile: ${user.phoneNumber}
Email: ${user.email}`;
  }

  await Notification.create({
    role: "receptionist",
    title,
    message,
    booking: booking._id
  });
};



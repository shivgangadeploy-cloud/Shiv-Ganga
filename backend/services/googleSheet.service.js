import { google } from "googleapis";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({
  version: "v4",
  auth
});

export const appendToSheet = async ({ spreadsheetId, range, rows }) => {
  if (!rows || rows.length === 0) return;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: rows
    }
  });
};

export const exportGuestsToSheet = async (guests) => {
  const rows = [
    ["First Name", "Last Name", "Email", "Phone", "Address"],
    ...guests.map(g => [
      g.firstName,
      g.lastName,
      g.email,
      g.phoneNumber,
      g.address
    ])
  ];

  await appendToSheet({
    spreadsheetId: process.env.GOOGLE_GUEST_SHEET_ID,
    range: "Sheet1!A1",
    rows
  });
};

export const exportBookingsToSheet = async (bookings) => {
  const rows = [
    [
      "Booking ID",
      "Guest Name",
      "Email",
      "Room Number",
      "Check-In",
      "Check-Out",
      "Amount",
      "Status",
      "Created At"
    ],
    ...bookings.map(b => [
      b._id.toString(),
      `${b.user.firstName} ${b.user.lastName}`,
      b.user.email,
      b.room.roomNumber,
      b.checkInDate.toISOString().split("T")[0],
      b.checkOutDate.toISOString().split("T")[0],
      b.totalAmount,
      b.bookingStatus,
      b.createdAt.toISOString()
    ])
  ];

  await appendToSheet({
    spreadsheetId: process.env.GOOGLE_BOOKING_SHEET_ID,
    range: "Sheet1!A1",
    rows
  });
};

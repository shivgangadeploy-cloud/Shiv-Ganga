import SibApiV3Sdk from "sib-api-v3-sdk";
import { config } from "../configs/env.js";
import SystemSetting from "../models/SystemSetting.model.js";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = config.BREVO_API_KEY;

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* ================= RESET PASSWORD ================= */
export const sendResetPasswordMail = async (toEmail, resetToken) => {
  const resetLink = `${config.CLIENT_URL}/login?resetToken=${resetToken}`;

  await transactionalEmailApi.sendTransacEmail({
    sender: {
      email: config.BREVO_SENDER_EMAIL,
      name: "Hotel Admin",
    },
    to: [{ email: toEmail }],
    subject: "Reset your password",
    htmlContent: `
      <p>Password reset requested</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 15 minutes</p>
    `,
  });
};

/* ================= RECEPTIONIST CREDENTIALS ================= */
export const sendReceptionistCredentialsMail = async ({
  fullName,
  email,
  password,
  employeeId,
}) => {
  await transactionalEmailApi.sendTransacEmail({
    sender: {
      name: "ShivGanga Hotel",
      email: config.BREVO_SENDER_EMAIL,
    },
    to: [{ email }],
    subject: "Your Receptionist Account Credentials",
    htmlContent: `
      <p>Hello <b>${fullName}</b>,</p>


      <p>You have been added as a <b>Receptionist</b> at ShivGanga Hotel.</p>


      <p><b>Login Details:</b></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Employee ID: ${employeeId}</li>
        <li>Temporary Password: ${password}</li>
      </ul>


      <p>Please change your password after first login.</p>


      <p>
        Login URL:<br/>
        <a href="${config.CLIENT_URL}/auth/login">
          ${config.CLIENT_URL}/auth/login
        </a>
      </p>


      <p>Regards,<br/>ShivGanga Hotel</p>
    `,
  });
};

/* ================= BOOKING CONFIRMATION ================= */
export const sendBookingConfirmationMail = async ({
  name,
  email,
  guestId,
  bookingReference,
  checkInDate,
  checkOutDate,
  nights,
  totalAmount,
  paidAmount,
  pendingAmount,
  coupon,
  activities,
}) => {
  const system = await SystemSetting.findOne().sort({ updatedAt: -1 });
  if (!system) throw new Error("System settings not configured");

  const primaryEmail =
    system.systemEmails?.[0]?.email || config.BREVO_SENDER_EMAIL;

  const primaryPhone = system.systemPhoneNumbers?.[0]?.phone || "N/A";

  const safeCoupon = coupon && typeof coupon === "object" ? coupon : null;
  const couponCode = safeCoupon?.code || "";
  const couponDiscount = safeCoupon?.discountAmount || 0;

  const amountBeforeDiscount = safeCoupon
    ? totalAmount + couponDiscount
    : totalAmount;

  const safeActivities =
    Array.isArray(activities) && activities.length > 0
      ? activities.map((a) => ({
          name: a?.name || "",
          quantity: Number(a?.quantity || 0),
          unitPrice: Number(a?.unitPrice || 0),
          totalPrice: Number(a?.totalPrice || 0),
        }))
      : [];

  await transactionalEmailApi.sendTransacEmail({
    sender: {
      email: config.BREVO_SENDER_EMAIL,
      name: system.systemHotelName,
    },
    to: [{ email }],
    subject: `Booking Confirmed | ${system.systemHotelName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
        <div style="max-width:650px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">


          <div style="text-align:center; margin-bottom:20px;">
            ${
              system.logo
                ? `<img src="${system.logo}" alt="${system.systemHotelName}" style="max-height:90px;" />`
                : ""
            }
            <h2 style="margin:10px 0;">${system.systemHotelName}</h2>
            <p style="color:#777;">Booking Confirmation & Receipt</p>
          </div>


          <p>Hello <b>${name || "Guest"}</b>,</p>


          <p>
            Thank you for choosing <b>${system.systemHotelName}</b>.
            Your booking has been successfully confirmed.
          </p>


          <h3>Booking Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td><b>Guest ID</b></td><td>${guestId || "-"}</td></tr>
            <tr><td><b>Reference Number</b></td><td>${bookingReference || "-"}</td></tr>
            <tr><td><b>Check-in</b></td><td>${checkInDate || "-"}</td></tr>
            <tr><td><b>Check-out</b></td><td>${checkOutDate || "-"}</td></tr>
            <tr><td><b>Nights</b></td><td>${nights ?? "-"}</td></tr>
          </table>

          ${
            safeActivities.length > 0
              ? `
          <hr/>
          <h3>Activities</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td><b>Activity</b></td>
              <td><b>Qty</b></td>
              <td><b>Unit Price</b></td>
              <td><b>Total</b></td>
            </tr>
            ${safeActivities
              .map(
                (a) =>
                  `<tr>
                    <td>${a.name}</td>
                    <td>${a.quantity}</td>
                    <td>₹${a.unitPrice}</td>
                    <td>₹${a.totalPrice}</td>
                  </tr>`
              )
              .join("")}
          </table>
              `
              : ""
          }


          <hr/>


          <h3>Payment Summary</h3>
          <table style="width:100%; border-collapse:collapse;">


            ${
              safeCoupon
                ? `
                  <tr>
                    <td>Amount Before Discount</td>
                    <td>₹${amountBeforeDiscount}</td>
                  </tr>
                  <tr>
                    <td>Coupon (${couponCode})</td>
                    <td>- ₹${couponDiscount}</td>
                  </tr>
                `
                : `
                  <tr>
                    <td>Total Amount</td>
                    <td>₹${totalAmount}</td>
                  </tr>
                `
            }


            <tr>
              <td><b>Net Payable Amount</b></td>
              <td><b>₹${totalAmount}</b></td>
            </tr>


            <tr>
              <td><b>Paid Amount</b></td>
              <td><b>₹${paidAmount || 0}</b></td>
            </tr>


            ${
              pendingAmount > 0
                ? `<tr><td>Pending Amount</td><td>₹${pendingAmount}</td></tr>`
                : ""
            }
          </table>


          <hr/>


          <h3>Need Assistance?</h3>
          <p>
            Phone: <b>${system.systemPhoneNumbers}</b><br/>
            Email: <b>${system.systemEmails}</b><br/>
            Address: ${system.systemAddress}
          </p>


          <p style="margin-top:20px;">
            Regards,<br/>
            <b>${system.systemHotelName}</b>
          </p>


        </div>
      </div>
    `,
  });
};

/* ================= CONTACT MAIL ================= */
export const sendContactMailToAdmin = async ({
  name,
  email,
  subject,
  message,
}) => {
  await transactionalEmailApi.sendTransacEmail({
    sender: {
      email: config.BREVO_SENDER_EMAIL,
      name: "ShivGanga Website",
    },
    to: [{ email: config.BREVO_SENDER_EMAIL }],
    subject: `New Contact Message: ${subject}`,
    htmlContent: `
      <h3>New Contact Query</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
    `,
  });
};

/* ================= EMAIL OTP ================= */
export const sendEmailOTP = async ({ email, otp }) => {
  await transactionalEmailApi.sendTransacEmail({
    sender: {
      email: config.BREVO_SENDER_EMAIL,
      name: config.BREVO_SENDER_NAME,
    },
    to: [{ email }],
    subject: "Your Booking OTP",
    htmlContent: `
      <h2>Verify your email</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};
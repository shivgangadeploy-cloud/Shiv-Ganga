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
  pricing,
  activities = [],
}) => {
  console.log("\n========== SENDING BOOKING CONFIRMATION EMAIL ==========");
  console.log("Booking Ref:", bookingReference);

  const system = await SystemSetting.findOne().sort({ updatedAt: -1 });
  if (!system) throw new Error("System settings not configured");

  const primaryEmail =
    Array.isArray(system.systemEmails) && system.systemEmails.length > 0
      ? system.systemEmails[0]
      : config.BREVO_SENDER_EMAIL;

  const primaryPhone =
    Array.isArray(system.systemPhoneNumbers) &&
    system.systemPhoneNumbers.length > 0
      ? system.systemPhoneNumbers[0]
      : "N/A";

  /* ================= PRICING (NO RE-CALCULATION) ================= */

  const grandTotal = Number(pricing?.grandTotal || 0);
  const paidAmount = Number(pricing?.paidAmount || 0);
  const pendingAmount = Number(pricing?.pendingAmount || 0);
  const coupon = pricing?.coupon || null;

  const formatINR = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /* ================= ACTIVITIES DISPLAY ================= */

  let activitiesHTML = "";

  if (Array.isArray(activities) && activities.length > 0) {
    activitiesHTML = `
      <hr/>
      <h3>Activities Booked</h3>
      <table style="width:100%; border-collapse:collapse; margin-top:10px; border:1px solid #ddd;">
        <thead>
          <tr style="background-color:#4CAF50; color:white;">
            <th style="padding:10px; text-align:left;">Activity</th>
            <th style="padding:10px; text-align:center;">Qty</th>
            <th style="padding:10px; text-align:right;">Unit (₹)</th>
            <th style="padding:10px; text-align:right;">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${activities
            .map(
              (a) => `
              <tr style="border-bottom:1px solid #ddd;">
                <td style="padding:10px;">${a.name}</td>
                <td style="padding:10px; text-align:center;">${a.quantity}</td>
                <td style="padding:10px; text-align:right;">
                  ₹${formatINR(a.unitPrice)}
                </td>
                <td style="padding:10px; text-align:right;">
                  ₹${formatINR(a.totalPrice)}
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  /* ================= PAYMENT SUMMARY ================= */

  let paymentHTML = `
    <h3>Payment Summary</h3>
    <table style="width:100%; border-collapse:collapse; margin-top:10px;">
  `;

  if (coupon && coupon.discountAmount > 0) {
    paymentHTML += `
      <tr>
        <td style="padding:8px;">Coupon Discount (${coupon.code})</td>
        <td style="padding:8px; text-align:right; color:green;">
          - ₹${formatINR(coupon.discountAmount)}
        </td>
      </tr>
    `;
  }

  paymentHTML += `
    <tr style="background-color:#e8f4f8; font-weight:bold; font-size:16px;">
      <td style="padding:12px;">GRAND TOTAL</td>
      <td style="padding:12px; text-align:right;">
        ₹${formatINR(grandTotal)}
      </td>
    </tr>

    <tr style="background-color:#d4edda; color:#155724;">
      <td style="padding:10px;"><b>Paid Amount</b></td>
      <td style="padding:10px; text-align:right;">
        <b>₹${formatINR(paidAmount)}</b>
      </td>
    </tr>
  `;

  if (pendingAmount > 0) {
    paymentHTML += `
      <tr style="background-color:#f8d7da; color:#721c24;">
        <td style="padding:10px;"><b>Pending Amount</b></td>
        <td style="padding:10px; text-align:right;">
          <b>₹${formatINR(pendingAmount)}</b>
        </td>
      </tr>
    `;
  }

  paymentHTML += `</table>`;

  /* ================= SEND EMAIL ================= */

  try {
    await transactionalEmailApi.sendTransacEmail({
      sender: {
        email: config.BREVO_SENDER_EMAIL,
        name: system.systemHotelName,
      },
      to: [{ email }],
      subject: `Booking Confirmed - ${bookingReference} | ${system.systemHotelName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
          <div style="max-width:650px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">

            <div style="text-align:center; margin-bottom:20px;">
              ${
                system.logo
                  ? `<img src="${system.logo}" alt="${system.systemHotelName}"
                     style="max-height:90px; margin-bottom:10px;" />`
                  : ""
              }
              <h2 style="margin:10px 0; color:#333;">
                ${system.systemHotelName}
              </h2>
              <p style="color:#666;">Booking Confirmation & Receipt</p>
            </div>

            <p>Hello <b>${name || "Guest"}</b>,</p>

            <p>
              Thank you for choosing <b>${system.systemHotelName}</b>.
              Your booking has been successfully confirmed.
            </p>

            <div style="background:#f9f9f9; padding:15px; border-radius:5px; margin:20px 0;">
              <h3>Booking Details</h3>
              <table style="width:100%;">
                <tr><td><b>Guest ID:</b></td><td>${guestId}</td></tr>
                <tr><td><b>Reference:</b></td><td>${bookingReference}</td></tr>
                <tr><td><b>Check-in:</b></td><td>${checkInDate}</td></tr>
                <tr><td><b>Check-out:</b></td><td>${checkOutDate}</td></tr>
                <tr><td><b>Nights:</b></td><td>${nights}</td></tr>
              </table>
            </div>

            ${activitiesHTML}

            <div style="background:#f9f9f9; padding:15px; border-radius:5px; margin:20px 0;">
              ${paymentHTML}
            </div>

            <div style="background:#e3f2fd; padding:16px; border-radius:6px;">
              <h3>Need Assistance?</h3>
              <p><b>Phone:</b> ${primaryPhone}</p>
              <p><b>Email:</b> ${primaryEmail}</p>
              <p><b>Address:</b> ${system.systemAddress}</p>
            </div>

            <p style="margin-top:30px; font-size:12px; text-align:center; color:#777;">
              This is an automated email. Please do not reply.
            </p>

            <p>
              Regards,<br/>
              <b>${system.systemHotelName}</b>
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ Booking confirmation email sent");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }

  console.log("========== EMAIL COMPLETE ==========\n");
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

/* ================= SUBSCRIPTION CONFIRMATION ================= */
export const sendSubscriptionConfirmationMail = async (toEmail) => {
  const system = await SystemSetting.findOne().sort({ updatedAt: -1 });
  const hotelName = system?.systemHotelName || "Shiv Ganga Hotel";
  const contactEmail =
    Array.isArray(system?.systemEmails) && system.systemEmails.length > 0
      ? system.systemEmails[0]
      : config.BREVO_SENDER_EMAIL;

  await transactionalEmailApi.sendTransacEmail({
    sender: {
      name: hotelName,
      email: config.BREVO_SENDER_EMAIL,
    },
    to: [{ email: toEmail }],
    subject: `You're subscribed to ${hotelName} • Exclusive updates inside`,
    htmlContent: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f6f6;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;">
          <div style="padding:24px 24px 0 24px;text-align:center;">
            ${system?.logo ? `<img src="${system.logo}" alt="${hotelName}" style="max-height:64px;margin-bottom:12px;" />` : ""}
            <h2 style="margin:8px 0 4px;color:#0f172a;">${hotelName}</h2>
            <p style="margin:0;color:#64748b;font-size:14px;">Subscription Confirmed</p>
          </div>

          <div style="padding:24px;">
            <p style="color:#0f172a;font-size:15px;line-height:1.6;margin:0 0 12px 0;">
              Hello,
            </p>
            <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 12px 0;">
              Thank you for subscribing to ${hotelName}. You’ll start receiving exclusive promotions,
              seasonal offers, and news about upcoming experiences straight to your inbox.
            </p>
            <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 12px 0;">
              We value your privacy and send only curated updates. You can unsubscribe at any time by replying to this email.
            </p>

            
          </div>

          <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #eef2f7;color:#64748b;font-size:12px;text-align:center;">
            <div>${hotelName}</div>
            ${system?.systemAddress ? `<div style="margin-top:4px;">${system.systemAddress}</div>` : ""}
          </div>
        </div>
      </div>
    `,
  });
};

export const sendAdminNewSubscriberMail = async ({ email }) => {
  const system = await SystemSetting.findOne().sort({ updatedAt: -1 });
  const hotelName = system?.systemHotelName || "Shiv Ganga Hotel";
  const adminEmail =
    Array.isArray(system?.systemEmails) && system.systemEmails.length > 0
      ? system.systemEmails[0]
      : config.BREVO_SENDER_EMAIL;

  await transactionalEmailApi.sendTransacEmail({
    sender: {
      name: hotelName,
      email: config.BREVO_SENDER_EMAIL,
    },
    to: [{ email: adminEmail }],
    subject: `New newsletter subscription: ${email}`,
    htmlContent: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;">
          <div style="padding:20px 24px;border-bottom:1px solid #eef2f7;">
            <h3 style="margin:0;color:#0f172a;">New Newsletter Subscriber</h3>
            <p style="margin:6px 0 0;color:#64748b;font-size:14px;">${hotelName}</p>
          </div>

          <div style="padding:20px 24px;">
            <p style="color:#0f172a;font-size:14px;margin:0 0 8px 0;">
              A user has subscribed to promotional emails:
            </p>
            <p style="font-size:16px;color:#0ea5e9;margin:0 0 12px 0;"><strong>${email}</strong></p>
            <p style="color:#334155;font-size:13px;line-height:1.6;margin:0;">
              You can view subscribers in your database or export them for campaigns.
            </p>
          </div>
        </div>
      </div>
    `,
  });
};

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
  // DEBUG: Log the complete received data
  console.log("\n========== SENDING BOOKING CONFIRMATION EMAIL ==========");
  console.log("📋 Booking Reference:", bookingReference);
  console.log("📧 Guest Email:", email);
  console.log("💰 Total Amount:", totalAmount);
  console.log("💳 Paid Amount:", paidAmount);
  console.log("⏳ Pending Amount:", pendingAmount);
  console.log("🎟️ Coupon:", JSON.stringify(coupon, null, 2));
  
  // CRITICAL: Log the raw activities data
  console.log("\n🔍 RAW ACTIVITIES DATA:");
  console.log("Type of activities:", typeof activities);
  console.log("Is Array?", Array.isArray(activities));
  console.log("Activities value:", JSON.stringify(activities, null, 2));
  
  if (activities) {
    console.log("Activities keys:", Object.keys(activities));
    if (Array.isArray(activities)) {
      console.log("Activities length:", activities.length);
      activities.forEach((item, index) => {
        console.log(`\nActivity ${index}:`, JSON.stringify(item, null, 2));
        console.log(`Activity ${index} type:`, typeof item);
        console.log(`Activity ${index} keys:`, item ? Object.keys(item) : 'No keys');
      });
    }
  }

  const system = await SystemSetting.findOne().sort({ updatedAt: -1 });
  if (!system) throw new Error("System settings not configured");

  const primaryEmail =
    Array.isArray(system.systemEmails) && system.systemEmails.length > 0
      ? system.systemEmails[0]
      : config.BREVO_SENDER_EMAIL;

  const primaryPhone =
    Array.isArray(system.systemPhoneNumbers) && system.systemPhoneNumbers.length > 0
      ? system.systemPhoneNumbers[0]
      : "N/A";

  // Price mapping for activities
  const PRICE_MAP = {
    "River Rafting": 2500,
    "Bungee Jumping": 4000,
    "Ganga Aarti": 0,
    "Yoga Session": 1500,
  };

  // Normalize key: lowercase + single space
  const normalizeActivityKey = (s) =>
    (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
  
  const NORMALIZED_PRICE_MAP = Object.fromEntries(
    Object.entries(PRICE_MAP).map(([k, v]) => [normalizeActivityKey(k), v]),
  );

  const safeCoupon = coupon && typeof coupon === "object" ? coupon : null;
  const couponCode = safeCoupon?.code || "";
  const couponDiscount = safeCoupon?.discountAmount || 0;

  const amountBeforeDiscount = safeCoupon
    ? Number(totalAmount || 0) + Number(couponDiscount || 0)
    : Number(totalAmount || 0);

  // Process activities with comprehensive data extraction
  let safeActivities = [];
  let activitiesTotal = 0;
  
  console.log("\n🔄 Processing activities...");
  
  // Check if activities exists and is an array
  if (activities && Array.isArray(activities) && activities.length > 0) {
    console.log(`✅ Found ${activities.length} activities to process`);
    
    safeActivities = activities.map((a, index) => {
      console.log(`\n--- Processing Activity ${index + 1} ---`);
      console.log("Raw activity data:", a);
      
      if (!a) {
        console.log("⚠️ Activity is null or undefined");
        return null;
      }
      
      // Try multiple possible property names for each field
      
      // 1. Extract name
      const activityName = 
        a?.activityName || 
        a?.name || 
        a?.title || 
        a?.activity || 
        a?.description ||
        a?.itemName ||
        a?.serviceName ||
        "Unknown Activity";
      console.log("Extracted name:", activityName);
      
      // 2. Extract quantity
      const quantity = Number(
        a?.quantity || 
        a?.qty || 
        a?.count || 
        a?.numberOfPeople ||
        a?.pax ||
        a?.participants ||
        1
      );
      console.log("Extracted quantity:", quantity);
      
      // 3. Extract unit price (try multiple fields)
      let unitPrice = 0;
      
      // Try various price fields
      const priceCandidates = [
        a?.unitPrice,
        a?.price,
        a?.rate,
        a?.unit_price,
        a?.amount,
        a?.cost,
        a?.charges,
        a?.fee
      ];
      
      for (const candidate of priceCandidates) {
        const num = Number(candidate);
        if (!isNaN(num) && num > 0) {
          unitPrice = num;
          break;
        }
      }
      
      // If still zero, try the price map
      if (unitPrice === 0 && activityName) {
        const lookupKey = normalizeActivityKey(activityName);
        unitPrice = NORMALIZED_PRICE_MAP[lookupKey] || 0;
        console.log(`Using price map for ${activityName}: ${unitPrice}`);
      }
      console.log("Extracted unit price:", unitPrice);
      
      // 4. Extract total price
      let totalPrice = 0;
      
      const totalCandidates = [
        a?.totalPrice,
        a?.total,
        a?.total_amount,
        a?.amount,
        a?.totalCost,
        a?.grandTotal,
        a?.subtotal
      ];
      
      for (const candidate of totalCandidates) {
        const num = Number(candidate);
        if (!isNaN(num) && num > 0) {
          totalPrice = num;
          break;
        }
      }
      
      // If total price is still zero but we have quantity and unit price, calculate it
      if (totalPrice === 0 && quantity > 0 && unitPrice > 0) {
        totalPrice = quantity * unitPrice;
        console.log(`Calculated total price: ${quantity} × ${unitPrice} = ${totalPrice}`);
      }
      
      console.log("Final total price:", totalPrice);

      const processedActivity = {
        name: activityName.toString().trim(),
        quantity: isNaN(quantity) ? 1 : quantity,
        unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
        totalPrice: isNaN(totalPrice) ? 0 : totalPrice,
        // Keep original data for reference
        originalData: a
      };
      
      console.log("✅ Processed activity:", processedActivity);
      return processedActivity;
    }).filter(activity => activity !== null); // Remove null activities
    
    console.log(`\n📊 Successfully processed ${safeActivities.length} activities`);
    
    // Calculate activities total
    activitiesTotal = safeActivities.reduce(
      (sum, a) => {
        const total = Number(a.totalPrice || 0);
        console.log(`Adding to sum: ${a.name} = ${total}`);
        return sum + total;
      },
      0,
    );
    
    console.log("💰 Activities Total calculated:", activitiesTotal);
  } else {
    console.log("⚠️ No activities found or activities is not an array");
    if (activities) {
      console.log("Activities is of type:", typeof activities);
      console.log("Activities value:", activities);
    }
  }

  // Format currency function
  const formatINR = (n) => {
    const num = Number(n || 0);
    return num.toLocaleString("en-IN", { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  // Calculate all amounts
  const roomCharges = Number(totalAmount || 0);
  const finalActivitiesTotal = Number(activitiesTotal || 0);
  const grandTotal = roomCharges + finalActivitiesTotal;
  const finalPaidAmount = Number(paidAmount || 0);
  
  // Calculate pending amount (grand total minus paid amount)
  // If pendingAmount is provided, use it, otherwise calculate
  const finalPendingAmount = pendingAmount !== undefined 
    ? Number(pendingAmount) 
    : Math.max(0, grandTotal - finalPaidAmount);

  console.log("\n📊 FINAL CALCULATIONS:");
  console.log("Room Charges:", roomCharges);
  console.log("Activities Total:", finalActivitiesTotal);
  console.log("Grand Total:", grandTotal);
  console.log("Paid Amount:", finalPaidAmount);
  console.log("Pending Amount:", finalPendingAmount);

  // Build the email HTML
  let activitiesHTML = '';
  
  if (safeActivities.length > 0) {
    activitiesHTML = `
      <hr/>
      <h3>Activities Booked</h3>
      <table style="width:100%; border-collapse:collapse; margin-top:10px; border:1px solid #ddd;">
        <thead>
          <tr style="background-color:#4CAF50; color:white;">
            <th style="padding:10px; text-align:left;">Activity</th>
            <th style="padding:10px; text-align:center;">Quantity</th>
            <th style="padding:10px; text-align:right;">Unit Price (₹)</th>
            <th style="padding:10px; text-align:right;">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${safeActivities
            .map(
              (a) => `
              <tr style="border-bottom:1px solid #ddd;">
                <td style="padding:10px; text-align:left;">${a.name}</td>
                <td style="padding:10px; text-align:center;">${a.quantity}</td>
                <td style="padding:10px; text-align:right;">${formatINR(a.unitPrice)}</td>
                <td style="padding:10px; text-align:right;">${formatINR(a.totalPrice)}</td>
              </tr>`
            )
            .join("")}
          <tr style="background-color:#f2f2f2; font-weight:bold;">
            <td colspan="3" style="padding:12px; text-align:right;">Activities Subtotal:</td>
            <td style="padding:12px; text-align:right;">₹${formatINR(finalActivitiesTotal)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  // Build payment summary HTML
  let paymentHTML = `
    <h3>Payment Summary</h3>
    <table style="width:100%; border-collapse:collapse; margin-top:10px;">
      <tr>
        <td style="padding:8px;"><b>Room Charges</b></td>
        <td style="padding:8px; text-align:right;">₹${formatINR(roomCharges)}</td>
      </tr>
  `;

  if (finalActivitiesTotal > 0) {
    paymentHTML += `
      <tr>
        <td style="padding:8px;"><b>Activities Charges</b></td>
        <td style="padding:8px; text-align:right;">₹${formatINR(finalActivitiesTotal)}</td>
      </tr>
    `;
  }

  if (safeCoupon && couponDiscount > 0) {
    paymentHTML += `
      <tr>
        <td style="padding:8px;">Coupon Discount (${couponCode})</td>
        <td style="padding:8px; text-align:right; color:green;">- ₹${formatINR(couponDiscount)}</td>
      </tr>
    `;
  }

  paymentHTML += `
    <tr style="background-color:#e8f4f8; font-weight:bold; font-size:16px;">
      <td style="padding:12px;">GRAND TOTAL</td>
      <td style="padding:12px; text-align:right;">₹${formatINR(grandTotal)}</td>
    </tr>
    <tr style="background-color:#d4edda; color:#155724;">
      <td style="padding:10px;"><b>Paid Amount</b></td>
      <td style="padding:10px; text-align:right;"><b>₹${formatINR(finalPaidAmount)}</b></td>
    </tr>
  `;

  if (finalPendingAmount > 0) {
    paymentHTML += `
      <tr style="background-color:#f8d7da; color:#721c24;">
        <td style="padding:10px;"><b>Pending Amount</b></td>
        <td style="padding:10px; text-align:right;"><b>₹${formatINR(finalPendingAmount)}</b></td>
      </tr>
    `;
  }

  paymentHTML += `</table>`;

  // Send the email
  try {
    console.log("\n📧 Sending email...");
    
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
                  ? `<img src="${system.logo}" alt="${system.systemHotelName}" style="max-height:90px; margin-bottom:10px;" />`
                  : ""
              }
              <h2 style="margin:10px 0; color:#333;">${system.systemHotelName}</h2>
              <p style="color:#666;">Booking Confirmation & Receipt</p>
            </div>

            <p>Hello <b>${name || "Guest"}</b>,</p>

            <p style="line-height:1.6;">
              Thank you for choosing <b>${system.systemHotelName}</b>.
              Your booking has been successfully confirmed.
            </p>

            <div style="background-color:#f9f9f9; padding:15px; border-radius:5px; margin:20px 0;">
              <h3 style="margin-top:0; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tr><td style="padding:5px;"><b>Guest ID:</b></td><td style="padding:5px;">${guestId || "-"}</td></tr>
                <tr><td style="padding:5px;"><b>Reference Number:</b></td><td style="padding:5px;">${bookingReference || "-"}</td></tr>
                <tr><td style="padding:5px;"><b>Check-in:</b></td><td style="padding:5px;">${checkInDate || "-"}</td></tr>
                <tr><td style="padding:5px;"><b>Check-out:</b></td><td style="padding:5px;">${checkOutDate || "-"}</td></tr>
                <tr><td style="padding:5px;"><b>Nights:</b></td><td style="padding:5px;">${nights ?? "-"}</td></tr>
              </table>
            </div>

            ${activitiesHTML}

            <div style="background-color:#f9f9f9; padding:15px; border-radius:5px; margin:20px 0;">
              ${paymentHTML}
            </div>

            <div style="background-color:#e3f2fd; padding:15px; border-radius:5px; margin:20px 0;">
              <h3 style="margin-top:0; color:#333;">Need Assistance?</h3>
              <p style="margin:5px 0;">
                <b>Phone:</b> ${primaryPhone}<br/>
                <b>Email:</b> ${primaryEmail}<br/>
                <b>Address:</b> ${system.systemAddress}
              </p>
            </div>

            <p style="margin-top:30px; color:#666; font-size:14px; text-align:center;">
              This is an automated email. Please do not reply to this message.
            </p>

            <p style="margin-top:20px;">
              Regards,<br/>
              <b>${system.systemHotelName}</b>
            </p>

          </div>
        </div>
      `,
    });
    
    console.log("✅ Email sent successfully!");
    
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
  
  console.log("========== EMAIL PROCESSING COMPLETE ==========\n");
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
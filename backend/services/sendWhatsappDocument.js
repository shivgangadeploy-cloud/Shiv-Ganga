import twilio from "twilio";
import { config } from "../configs/env.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppDocument = async ({
  phone,
  documentUrl,
  filename
}) => {

  const formattedPhone = phone.startsWith("+")
    ? phone
    : `+91${phone}`;

await client.messages.create({
  from: config.TWILIO_WHATSAPP_FROM,
  to: `whatsapp:${formattedPhone}`,
  contentSid: config.TWILIO_INVOICE_TEMPLATE_SID,
  contentVariables: JSON.stringify({
    1: booking.user.firstName
  }),
  mediaUrl: [documentUrl]
});

};

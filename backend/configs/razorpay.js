import Razorpay from "razorpay";
import { config } from "../configs/env.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,       
  key_secret: config.RAZORPAY_SECRET
});

export default razorpay;



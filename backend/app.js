import express from "express"
import cors from "cors"
import {fileURLToPath} from "url"
import helmet from "helmet"
import path from "path"
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import roomRoutes from "./routes/room.routes.js"
import onlineBookingRoutes from "./routes/onlineBooking.routes.js"
import receptionistRoutes from "./routes/receptionist.routes.js"
import testimonialRoutes from "./routes/testimonial.routes.js"
import adminDashboardRoutes from "./routes/adminDashboard.routes.js"
import contactRoutes from "./routes/contact.routes.js"
import checkInOutRoutes from "./routes/checkInOut.routes.js"
import staffSalaryRoutes from "./routes/staffSalary.routes.js";
import { multerErrorMiddleware } from "./middlewares/multerError.middleware.js"
import staffReportRoutes from "./routes/staffReport.routes.js";
import guestRoutes from "./routes/guestDirectory.routes.js"
import receptionistDashboardRoutes from "./routes/receptionistDashboard.routes.js"
import offlineBookingRoutes from "./routes/offlineBooking.routes.js"
import operationalBookingRoutes from "./routes/operationalBooking.routes.js"
import receptionistProfileRoutes from "./routes/receptionsitProfile.routes.js"
import couponRoutes from "./routes/coupon.routes.js"
import galleryRoutes from "./routes/gallery.routes.js"
import systemSettingRoutes from "./routes/systemSetting.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import taxesAndBillingRoutes from "./routes/taxesAndBilling.routes.js"
import bookingPolicyRoutes from "./routes/bookingPolicy.routes.js"
import otpRoutes from "./routes/otp.routes.js"
import "./cron/coupon.cron.js";
import membershipRoutes from "./routes/membership.routes.js";
const app = express()
const __filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(__filename)

app.use(helmet());
app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://shiv-ganga-3.onrender.com",
  "https://shiv-ganga-frontend-po3g.vercel.app" // 👈 ADD THIS
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes)
app.use("/api", roomRoutes)
app.use("/api", onlineBookingRoutes);
app.use("/api", receptionistRoutes)
app.use("/api", testimonialRoutes)
app.use("/api", contactRoutes)
app.use("/api", adminDashboardRoutes)
app.use("/api", checkInOutRoutes)
app.use("/api", staffSalaryRoutes)
app.use("/api", staffReportRoutes)
app.use("/api", guestRoutes)
app.use("/api", receptionistDashboardRoutes)
app.use("/api", offlineBookingRoutes)
app.use("/api", operationalBookingRoutes)
app.use("/api", receptionistProfileRoutes)
app.use("/api", couponRoutes)
app.use("/api", galleryRoutes)
app.use("/api", systemSettingRoutes)
app.use("/api", notificationRoutes)
app.use("/api", taxesAndBillingRoutes);
app.use("/api", bookingPolicyRoutes)
app.use("/api", otpRoutes)
app.use("/api", membershipRoutes);

app.use("/health",(_,res)=>{
  res.status(200).json({
    success:true,
    status:"OK"
  })
})

app.use(multerErrorMiddleware);
app.use(errorMiddleware)
export default app
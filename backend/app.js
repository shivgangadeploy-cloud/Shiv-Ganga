import express from "express"
import cors from "cors"
import {fileURLToPath} from "url"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
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
import newsletterRoutes from "./routes/newsletter.routes.js"
const app = express()
const __filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(__filename)

// ---------- CORS (apply BEFORE any rate limiters) ----------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://shiv-ganga-3.onrender.com",
  "https://shiv-ganga-frontend-po3g.vercel.app",
  "https://hotelshivganga.in",
  "https://www.hotelshivganga.in",
  "http://hotelshivganga.in",
  "http://www.hotelshivganga.in"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // Allow Accept header for newsletter footer subscription and other JSON APIs
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 204,
  preflightContinue: false
};

app.use(cors(corsOptions));
// Enable CORS pre-flight for all routes (Express 5 + path-to-regexp safe)
app.options(/.*/, cors(corsOptions));

// Security: Helmet with enhanced HSTS
app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: false
}));

// Compression middleware for all responses
app.use(compression());


// Global rate limiting (applies to all routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Do not rate-limit CORS preflight requests or auth endpoints (auth has its own limiter)
  skip: (req) =>
    req.method === "OPTIONS" ||
    req.path?.startsWith("/api/auth"),
});

app.use(globalLimiter);

// Tighter rate limiting for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  handler: (req, res) => {
    res.status(429).json({ success: false, message: "Too many login attempts, please try again later." });
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 contact submissions per hour per IP
  handler: (req, res) => {
    res.status(429).json({ success: false, message: "Too many contact submissions per hour from this IP" });
  },
});

const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 booking attempts per 5 minutes
  handler: (req, res) => {
    res.status(429).json({ success: false, message: "Too many booking attempts, please try again later." });
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", roomRoutes);
app.use("/api", receptionistRoutes);
app.use("/api", testimonialRoutes);
app.use("/api", contactRoutes);
app.use("/api", adminDashboardRoutes);
app.use("/api", checkInOutRoutes);
app.use("/api", staffSalaryRoutes);
app.use("/api", staffReportRoutes);
app.use("/api", guestRoutes);
app.use("/api", receptionistDashboardRoutes);
app.use("/api", offlineBookingRoutes);
app.use("/api", operationalBookingRoutes);
app.use("/api", receptionistProfileRoutes);
app.use("/api", couponRoutes);
app.use("/api", galleryRoutes);
app.use("/api", systemSettingRoutes);
app.use("/api", notificationRoutes);
app.use("/api", taxesAndBillingRoutes);
app.use("/api", bookingPolicyRoutes);
app.use("/api", otpRoutes);
app.use("/api", membershipRoutes);
app.use("/api", newsletterRoutes);

app.use("/health",(_,res)=>{
  res.status(200).json({
    success:true,
    status:"OK"
  })
})

app.use(multerErrorMiddleware);
app.use(errorMiddleware)
export default app

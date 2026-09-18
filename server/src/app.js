import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import os from "os";

import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import vetRoutes from "./routes/vetRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import shelterRoutes from "./routes/shelterRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import careRoutes from "./routes/careRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import healthRecordRoutes from "./routes/healthRecordRoutes.js";
import medicalDocumentRoutes from "./routes/medicalDocumentRoutes.js";
import insuranceRoutes from "./routes/insuranceRoutes.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser requests (curl, Postman, health checks)

      const isAllowedExact = allowedOrigins.includes(origin);
      // Allow any Vercel preview URL of the frontend project too, e.g.
      // https://fur-shield-complete-<hash>-hassan-857d.vercel.app
      const isVercelPreview = /^https:\/\/fur-shield-complete-.*\.vercel\.app$/.test(origin);

      if (isAllowedExact || isVercelPreview) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Serve uploaded images/videos as static files. The Cross-Origin-Resource-Policy
// header is relaxed just for this path so the Vite dev server (a different
// origin) can load these files in <img>/<video> tags.
app.use("/uploads", (req, res, next) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(os.tmpdir(), "furshield-uploads")));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", limiter);

app.get("/api/health", (req, res) => res.json({ success: true, message: "FurShield API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vets", vetRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/shelter", shelterRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/care", careRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/medical-documents", medicalDocumentRoutes);
app.use("/api/insurance", insuranceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

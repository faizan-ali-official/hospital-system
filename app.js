import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import doctorRoutes from "./routes/doctor.js";
import patientSlipRoutes from "./routes/patientSlip.js";
import feesRoutes from "./routes/fees.js";
import reportRoutes from "./routes/report.js";
import serviceRoutes from "./routes/service.js";
import discountRoutes from "./routes/discount.js";
import communityCardRoutes from "./routes/communityCard.js";
import pool from "./config/db.js";
import cors from "cors";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient-slips", patientSlipRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/community-cards", communityCardRoutes);

app.use(express.static(path.resolve(path.join(__dirname, "./frontend/dist"))));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/dist", "index.html"));
});

// Test DB connection before starting server
(async () => {
  try {
    await pool.getConnection();
    console.log("Connected to MySQL database.");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  }
})();

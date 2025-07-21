import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import doctorRoutes from "./routes/doctor.js";
import patientSlipRoutes from "./routes/patientSlip.js";
import feesRoutes from "./routes/fees.js";
import pool from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient-slips", patientSlipRoutes);
app.use("/api/fees", feesRoutes);

const PORT = process.env.PORT || 3000;

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

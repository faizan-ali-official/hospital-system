import express from "express";
import ReportController from "../controllers/reportController.js";

const router = express.Router();

router.get("/patient-slip-appointment", ReportController.getPatientSlipAppointmentReport);
router.get("/patient-slip-pharmacy", ReportController.getPatientSlipPharmacyReport);

export default router;
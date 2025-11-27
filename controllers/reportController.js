import PatientSlip from "../models/patientSlip.js";

class ReportController {
  static async getPatientSlipAppointmentReport(req, res) {
    try {
      const { startDate, endDate, doctor_id, created_by } = req.query;

      const report = await PatientSlip.getSlipAppointmentReport({
        startDate,
        endDate,
        doctor_id,
        created_by
      });

      return res.json(report);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }
  static async getPatientSlipPharmacyReport(req, res) {
    try {
      const { startDate, endDate, doctor_id, created_by } = req.query;

      const report = await PatientSlip.getSlipPharmacyReport({
        startDate,
        endDate,
        doctor_id,
        created_by
      });

      return res.json(report);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }
}

export default ReportController;

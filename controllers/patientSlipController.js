import PatientSlip from "../models/patientSlip.js";

class PatientSlipController {
  static async createPatientSlip(req, res) {
    try {
      const {
        patient_name,
        doctor_id,
        fees_id,
        status,
        reference_token_no,
        notes,
        slip_type_id,
        pharmacy_fees,
        age,
        gender,
      } = req.body;
      const created_by = req.user.id;
      const token_no = await PatientSlip.getNextTokenNoForToday();
      if (slip_type_id === 1) {
        await PatientSlip.create({
          patient_name,
          doctor_id,
          fees_id,
          token_no,
          created_by,
          slip_type_id,
          age,
          gender,
        });
      } else if (slip_type_id === 2) {
        await PatientSlip.create({
          patient_name,
          doctor_id,
          token_no,
          reference_token_no,
          created_by,
          slip_type_id,
          age,
          gender,
          notes,
          pharmacy_fees,
        });
      } else {
        await PatientSlip.create({
          patient_name,
          doctor_id,
          fees_id,
          token_no,
          reference_token_no,
          created_by,
          slip_type_id,
          age,
          gender,
          notes,
          pharmacy_fees,
        });
      }
      return res
        .status(201)
        .json({ data: req.body, message: "Created Successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }

  static async getPatientSlips(req, res) {
    try {
      const {
        startDate,
        endDate,
        doctor_id,
        created_by,
        fees_id,
        slip_type_id,
        status,
        search,
        limit,
        offset,
      } = req.query;
      const slips = await PatientSlip.findAll({
        startDate,
        endDate,
        doctor_id,
        created_by,
        fees_id,
        slip_type_id,
        status,
        search,
        limit,
        offset,
      });
      return res.json(slips);
    } catch (err) {
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }

  static async getPatientSlipById(req, res) {
    try {
      const { id } = req.params;
      const slip = await PatientSlip.findById(id);
      if (!slip) {
        return res.status(404).json({ message: "Patient slip not found." });
      }
      return res.json(slip);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async updatePatientSlip(req, res) {
    try {
      const { id } = req.params;
      const {
        patient_name,
        doctor_id,
        fees_id,
        status,
        reference_token_no,
        notes,
        pharmacy_fees,
      } = req.body;
      const slip = await PatientSlip.findById(id);
      if (!slip) {
        return res.status(404).json({ message: "Patient slip not found." });
      }
      const updated = await PatientSlip.update(id, {
        patient_name,
        doctor_id,
        fees_id,
        status,
        reference_token_no,
        notes,
        pharmacy_fees,
      });
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }
      return res.json({ message: "Patient slip updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async updatePatientSlipStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (typeof status !== "boolean") {
        return res.status(400).json({ message: "Status must be a boolean." });
      }
      const slip = await PatientSlip.findById(id);
      if (!slip) {
        return res.status(404).json({ message: "Patient slip not found." });
      }
      const updated = await PatientSlip.updateStatus(id, status);
      if (!updated) {
        return res.status(400).json({ message: "Status not updated." });
      }
      return res.json({ message: "Patient slip status updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async deletePatientSlip(req, res) {
    try {
      const { id } = req.params;
      const slip = await PatientSlip.findById(id);
      if (!slip) {
        return res.status(404).json({ message: "Patient slip not found." });
      }
      await PatientSlip.delete(id);
      return res.json({ message: "Patient slip deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }
}

export default PatientSlipController;

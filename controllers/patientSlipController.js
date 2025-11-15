import PatientSlip from "../models/patientSlip.js";

class PatientSlipController {
  static async createPatientSlip(req, res) {
    let slipId;
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
      if (slip_type_id === 1) {
        const token_no = await PatientSlip.getNextTokenNoForToday();
        slipId = await PatientSlip.create({
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
        slipId = await PatientSlip.create({
          patient_name,
          doctor_id,
          token_no: "",
          reference_token_no,
          created_by,
          slip_type_id,
          age,
          gender,
          notes,
          pharmacy_fees,
        });
      } else {
        slipId = await PatientSlip.create({
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
      const fullData = await PatientSlip.findById(slipId);
      return res
        .status(201)
        .json({ data: fullData, message: "Created Successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }

  static async createBulkPatientSlips(req, res) {
    try {
      const { slips } = req.body; // expect an array of slips
      const created_by = req.user.id;

      if (!Array.isArray(slips) || slips.length === 0) {
        return res.status(400).json({ message: "Slips array is required" });
      }

      // Attach created_by to all slips
      const slipsWithUser = slips.map((slip) => ({
        ...slip,
        created_by,
      }));

      await PatientSlip.createBulk(slipsWithUser);

      return res.status(201).json({ message: "Bulk Created Successfully" });
    } catch (err) {
      console.log(err);
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
        deleted,
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
        deleted,
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
        gender,
        age,
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
        gender,
        age,
      });
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }
      const data = await PatientSlip.findById(id);

      return res.json({
        message: "Patient slip updated successfully.",
        updatedData: data,
      });
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
      const { delete_note } = req.body;
      const deleted_by = req.user.id;

      const slip = await PatientSlip.findById(id);
      if (!slip) {
        return res.status(404).json({ message: "Patient slip not found." });
      }
      await PatientSlip.delete(id, delete_note, deleted_by);
      return res.json({ message: "Patient slip deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }
}

export default PatientSlipController;

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
        service_id
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
          gender
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
          service_id
        });
        await PatientSlip.addServices(slipId, service_id);
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
          pharmacy_fees
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
        created_by
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
        deleted
      } = req.query;
      let slips = await PatientSlip.findAll({
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
        deleted
      });

      const slipsMap = new Map();

      slips.forEach((row) => {
        if (!slipsMap.has(row.id)) {
          slipsMap.set(row.id, {
            id: row.id,
            patient_name: row.patient_name,
            doctor_id: row.doctor_id,
            doctor_name: row.doctor_name,
            fees_id: row.fees_id,
            token_no: row.token_no,
            reference_token_no: row.reference_token_no,
            created_by: row.created_by,
            slip_type_id: row.slip_type_id,
            pharmacy_fees: row.pharmacy_fees,
            notes: row.notes,
            doctor_fee: row.doctor_fee,
            slip_type_name: row.type_name,
            created_by_name: row.created_by_name,
            deleted_by_name: row.deleted_by,
            age: row.age,
            gender: row.gender,
            deleted_at: row.deleted_at,
            delete_note: row.delete_note,
            created_at: row.created_at,
            updated_at: row.updated_at,
            services: []
          });
        }

        // Add service only if it exists
        if (row.service_id !== null) {
          slipsMap.get(row.id).services.push({
            id: row.service_id,
            name: row.service_name,
            fees: row.service_fees
          });
        }
      });

      return res.json(Array.from(slipsMap.values()));
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

      const slipsMap = new Map();

      slip.forEach((row) => {
        if (!slipsMap.has(row.id)) {
          slipsMap.set(row.id, {
            id: row.id,
            patient_name: row.patient_name,
            doctor_id: row.doctor_id,
            doctor_name: row.doctor_name,
            fees_id: row.fees_id,
            token_no: row.token_no,
            reference_token_no: row.reference_token_no,
            created_by: row.created_by,
            slip_type_id: row.slip_type_id,
            pharmacy_fees: row.pharmacy_fees,
            notes: row.notes,
            doctor_fee: row.doctor_fee,
            slip_type_name: row.type_name,
            created_by_name: row.created_by_name,
            deleted_by_name: row.deleted_by,
            age: row.age,
            gender: row.gender,
            deleted_at: row.deleted_at,
            delete_note: row.delete_note,
            created_at: row.created_at,
            updated_at: row.updated_at,
            services: []
          });
        }

        // Add service only if it exists
        if (row.service_id !== null) {
          slipsMap.get(row.id).services.push({
            id: row.service_id,
            name: row.service_name,
            fees: row.service_fees
          });
        }
      });

      return res.json(Array.from(slipsMap.values()));
    } catch (err) {
      return res.status(500).json({ message: "Server error. " + err.message });
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
        service_id
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
        service_id
      });
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }
      const data = await PatientSlip.findById(id);

      return res.json({
        message: "Patient slip updated successfully.",
        updatedData: data
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

import Doctor from '../models/doctor.js';

class DoctorController {
  static async createDoctor(req, res) {
    try {
      const { doctor_name, specialization } = req.body;
      const doctorId = await Doctor.create({ doctor_name, specialization });
      return res.status(201).json({ id: doctorId, doctor_name, specialization });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async getDoctors(req, res) {
    try {
      const doctors = await Doctor.findAll();
      return res.json(doctors);
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async getDoctorById(req, res) {
    try {
      const { id } = req.params;
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }
      return res.json(doctor);
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const { doctor_name, specialization } = req.body;
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }
      const updated = await Doctor.update(id, { doctor_name, specialization });
      if (!updated) {
        return res.status(400).json({ message: 'Nothing to update.' });
      }
      return res.json({ message: 'Doctor updated successfully.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async deleteDoctor(req, res) {
    try {
      const { id } = req.params;
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }
      await Doctor.delete(id);
      return res.json({ message: 'Doctor deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }
}

export default DoctorController; 
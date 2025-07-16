import { Router } from 'express';
import DoctorController from '../controllers/doctorController.js';
import { createDoctorValidation, updateDoctorValidation, doctorIdParamValidation } from '../middlewares/validation.js';
import authenticateToken, { isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all doctor routes with authentication and admin check
router.use(authenticateToken, isAdmin);

// Create doctor
router.post('/', createDoctorValidation, DoctorController.createDoctor);
// Get all doctors
router.get('/', DoctorController.getDoctors);
// Get doctor by id
router.get('/:id', doctorIdParamValidation, DoctorController.getDoctorById);
// Update doctor
router.put('/:id', doctorIdParamValidation, updateDoctorValidation, DoctorController.updateDoctor);
// Delete doctor
router.delete('/:id', doctorIdParamValidation, DoctorController.deleteDoctor);

export default router; 
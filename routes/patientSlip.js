import { Router } from 'express';
import PatientSlipController from '../controllers/patientSlipController.js';
import authenticateToken, { isAdmin } from '../middlewares/authMiddleware.js';
import { patientSlipValidation } from '../middlewares/validation.js';
import { param } from 'express-validator';

const router = Router();

// Protect all patient slip routes with authentication and admin check
router.use(authenticateToken);

// Create patient slip
router.post('/', patientSlipValidation.create, PatientSlipController.createPatientSlip);
// Get all patient slips
router.get('/', PatientSlipController.getPatientSlips);
// Get patient slip by id
router.get('/:id', patientSlipValidation.idParam, PatientSlipController.getPatientSlipById);
// Update patient slip
router.put('/:id', patientSlipValidation.idParam, patientSlipValidation.update, PatientSlipController.updatePatientSlip);
// Update patient slip status only
router.patch('/:id/status', patientSlipValidation.idParam, patientSlipValidation.status, PatientSlipController.updatePatientSlipStatus);
// Delete patient slip
router.delete('/:id', patientSlipValidation.idParam, PatientSlipController.deletePatientSlip);
export default router; 
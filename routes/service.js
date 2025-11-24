import { Router } from 'express';
import { createAndUpdateServiceValidation, IdParamValidation } from '../middlewares/validation.js';
import authenticateToken, { isAdmin } from '../middlewares/authMiddleware.js';
import ServiceController from '../controllers/servicesController.js';

const router = Router();

// Protect all user routes with authentication and admin check
router.use(authenticateToken);

// Create user
router.post('/', createAndUpdateServiceValidation, isAdmin, ServiceController.createService);
// Get all users
router.get('/', ServiceController.getServices);
// Get user by id
router.get('/:id', IdParamValidation, ServiceController.getServiceById);
// Update user
router.put('/:id', IdParamValidation, createAndUpdateServiceValidation, isAdmin, ServiceController.updateService);
// Delete user
router.delete('/:id', IdParamValidation, isAdmin, ServiceController.deleteUser);

export default router; 
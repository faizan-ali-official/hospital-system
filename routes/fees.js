import { Router } from 'express';
import FeesController from '../controllers/feesController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = Router();

// Optionally protect with authentication
// router.use(authenticateToken);

router.get('/', FeesController.getAllFees);

export default router; 
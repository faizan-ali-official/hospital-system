import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middlewares/validation.js';

const router = Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

export default router; 
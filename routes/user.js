import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { createUserValidation, updateUserValidation, userIdParamValidation } from '../middlewares/validation.js';
import authenticateToken, { isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all user routes with authentication and admin check
router.use(authenticateToken, );

// Create user
router.post('/', createUserValidation, isAdmin, UserController.createUser);
// Get all users
router.get('/', UserController.getUsers);
// Get user by id
router.get('/:id', userIdParamValidation, UserController.getUserById);
// Update user
router.put('/:id', userIdParamValidation, updateUserValidation, isAdmin, UserController.updateUser);
// Delete user
router.delete('/:id', userIdParamValidation, isAdmin, UserController.deleteUser);

export default router; 
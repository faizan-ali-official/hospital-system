import { body, validationResult, param } from 'express-validator';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('roleId').notEmpty().withMessage('Role ID is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
  body('email').optional().isEmail().withMessage('Valid email is required.'),
  body('roleId').optional().notEmpty().withMessage('Role ID cannot be empty.'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const userIdParamValidation = [
  (req, res, next) => {
    if (!/^[0-9]+$/.test(req.params.id)) {
      return res.status(400).json({ errors: [{ msg: 'Invalid user ID.' }] });
    }
    next();
  }
];

export const createDoctorValidation = [
  body('doctor_name').notEmpty().withMessage('Doctor name is required.'),
  body('specialization').notEmpty().withMessage('Specialization is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updateDoctorValidation = [
  body('doctor_name').optional().notEmpty().withMessage('Doctor name cannot be empty.'),
  body('specialization').optional().notEmpty().withMessage('Specialization cannot be empty.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const doctorIdParamValidation = [
  param('id').isInt().withMessage('Invalid doctor ID.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 
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

export const patientSlipValidation = {
  create: [
    body('patient_name').notEmpty().withMessage('Patient name is required.'),
    body('doctor_id').isInt().withMessage('Doctor ID must be an integer.'),
    body('fees_id').isInt().withMessage('Fees ID must be an integer.'),
    body('reference_token_no').optional().isInt().withMessage('Reference token number must be an integer.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],
  update: [
    body('patient_name').optional().notEmpty().withMessage('Patient name cannot be empty.'),
    body('doctor_id').optional().isInt().withMessage('Doctor ID must be an integer.'),
    body('fees_id').optional().isInt().withMessage('Fees ID must be an integer.'),
    // body('token_no').optional().isInt().withMessage('Token number must be an integer.'),
    body('status').optional().isBoolean().withMessage('Status must be boolean.'),
    body('reference_token_no').optional().isInt().withMessage('Reference token number must be an integer.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],
  idParam: [
    param('id').isInt().withMessage('Invalid patient slip ID.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],
  status: [
    body('status').isBoolean().withMessage('Status must be boolean.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ]
}; 
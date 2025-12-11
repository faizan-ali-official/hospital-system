import { body, validationResult, param } from "express-validator";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const loginValidation = [
  body("username").notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const createUserValidation = [
  // body("name").notEmpty().withMessage("Name is required."),
  body("username").notEmpty().withMessage("User name is required."),
  body("email").isEmail().optional().withMessage("Valid email is required."),
  body("roleId").notEmpty().withMessage("Role ID is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updateUserValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty."),
  body("roleId").optional().notEmpty().withMessage("Role ID cannot be empty."),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const IdParamValidation = [
  (req, res, next) => {
    if (!/^[0-9]+$/.test(req.params.id)) {
      return res.status(400).json({ errors: [{ msg: "Invalid user ID." }] });
    }
    next();
  }
];

export const createDoctorValidation = [
  body("doctor_name").notEmpty().withMessage("Doctor name is required."),
  body("specialization").notEmpty().withMessage("Specialization is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const updateDoctorValidation = [
  body("doctor_name")
    .optional()
    .notEmpty()
    .withMessage("Doctor name cannot be empty."),
  body("specialization")
    .optional()
    .notEmpty()
    .withMessage("Specialization cannot be empty."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const doctorIdParamValidation = [
  param("id").isInt().withMessage("Invalid doctor ID."),
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
    body("patient_name").notEmpty().withMessage("Patient name is required."),
    body("doctor_id").isInt().withMessage("Doctor ID must be an integer."),
    body("fees_id")
      .optional()
      .isInt()
      .withMessage("Fees ID must be an integer."),
    body("slip_type_id")
      .optional()
      .isInt()
      .withMessage("Slip Type ID must be an integer."),
    body("reference_token_no")
      .optional()
      .isInt()
      .withMessage("Reference token number must be an integer."),
    body("token_no")
      .optional()
      .isInt()
      .withMessage("Token number must be an integer."),
    body("notes").optional().isString(),
    body("pharmacy_fees")
      .optional()
      .isInt()
      .withMessage("Notes must be an int."),
    body("age").notEmpty().isInt().withMessage("Age must be an integer."),
    body("gender").notEmpty().withMessage("Gender is required."),
    body("service_id")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Service IDs must be an array."),
    body("service_id.*")
      .isInt()
      .withMessage("Each service ID must be an integer."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],

  update: [
    body("patient_name")
      .optional()
      .notEmpty()
      .withMessage("Patient name cannot be empty."),
    body("doctor_id")
      .optional()
      .isInt()
      .withMessage("Doctor ID must be an integer."),
    body("fees_id")
      .optional()
      .isInt()
      .withMessage("Fees ID must be an integer."),
    body("slip_type_id")
      .optional()
      .isInt()
      .withMessage("Slip Type ID must be an integer."),
    body("reference_token_no")
      .optional()
      .isInt()
      .withMessage("Reference token number must be an integer."),
    body("token_no")
      .optional()
      .isInt()
      .withMessage("Token number must be an integer."),
    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be boolean."),
    body("notes").optional().isString().withMessage("Notes must be a string."),
    body("pharmacy_fees")
      .optional()
      .isInt()
      .withMessage("Notes must be an int."),
    body("service_id")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Service IDs must be an array."),
    body("service_id.*")
      .isInt()
      .withMessage("Each service ID must be an integer."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],

  idParam: [
    param("id").isInt().withMessage("Invalid patient slip ID."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],

  delete: [
    body("delete_note").notEmpty().withMessage("Delete note cannot be empty."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],

  status: [
    body("status").isBoolean().withMessage("Status must be boolean."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ]
};

export const createAndUpdateServiceValidation = [
  body("name").notEmpty().withMessage("Service name is required."),
  body("fees").notEmpty().withMessage("Service fees is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const communityCardValidation = {
  create: [
    body("full_name").notEmpty().withMessage("full_name is required."),
    body("guardian_name").notEmpty().withMessage("guardian_name is required."),
    body("cnic").notEmpty().withMessage("cnic is required."),
    body("parent_id")
      .optional()
      .custom((value) => value === null || /^[0-9]+$/.test(String(value)))
      .withMessage("parent_id must be an integer or null."),
    body("relations")
      .optional()
      .isArray()
      .withMessage("relations must be an array."),
    body("relations.*.full_name")
      .optional()
      .notEmpty()
      .withMessage("relations[*].full_name is required."),
    body("relations.*.relation")
      .optional()
      .notEmpty()
      .withMessage("relations[*].relation is required."),
    body("relations.*.date_of_birth")
      .optional()
      .isISO8601()
      .withMessage("relations[*].date_of_birth must be a valid date."),
    body("relations.*.cnic")
      .optional(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],
  update: [
    body("gender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("gender must be one of male, female, other."),
    body("parent_id")
      .optional()
      .custom((value) => value === null || /^[0-9]+$/.test(String(value)))
      .withMessage("parent_id must be an integer or null."),
    body("family_members_count")
      .optional()
      .isInt({ min: 0 })
      .withMessage("family_members_count must be a positive integer."),
    body("date_of_birth")
      .optional()
      .isISO8601()
      .withMessage("date_of_birth must be a valid date."),
    body("relations")
      .optional()
      .isArray()
      .withMessage("relations must be an array."),
    body("relations.*.full_name")
      .optional()
      .notEmpty()
      .withMessage("relations[*].full_name is required."),
    body("relations.*.relation")
      .optional()
      .notEmpty()
      .withMessage("relations[*].relation is required."),
    body("relations.*.date_of_birth")
      .optional()
      .isISO8601()
      .withMessage("relations[*].date_of_birth must be a valid date."),
    body("relations.*.cnic")
      .optional(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],
  idParam: [
    param("id").isInt().withMessage("Invalid record ID."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ]
};
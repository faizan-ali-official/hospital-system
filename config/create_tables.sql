CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  role_id INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_fee INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);


-- Table for patient slips
CREATE TABLE IF NOT EXISTS patient_slip (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  doctor_id INTEGER NOT NULL,
  fees_id INTEGER NOT NULL,
  token_no INTEGER NOT NULL,
  reference_token_no INTEGER DEFAULT NULL,
  status BOOLEAN DEFAULT TRUE,
  created_by INTEGER NOT NULL,
  slip_type_id INTEGER,
  pharmacy_fees VARCHAR(100) NULL,
  notes TEXT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (slip_type_id) REFERENCES slip_type(id)
);

CREATE TABLE IF NOT EXISTS slip_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

-- Insert example slip types
INSERT INTO slip_type (type_name) VALUES
  ('appointment'),
  ('pharmacy'),
ON DUPLICATE KEY UPDATE type_name=VALUES(type_name);

ALTER TABLE patient_slip
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN delete_note TEXT NULL;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  service_fees INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

ALTER TABLE users
ADD COLUMN username VARCHAR(50) NULL;

CREATE TABLE IF NOT EXISTS community_card_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NULL,
  full_name VARCHAR(150) NOT NULL,
  guardian_name VARCHAR(150) NOT NULL,
  cnic VARCHAR(25) NOT NULL,
  cast VARCHAR(100) NULL,
  date_of_birth DATE NULL,
  current_address TEXT NULL,
  permanent_address TEXT NULL,
  contact_number VARCHAR(30) NULL,
  education VARCHAR(100) NULL,
  occupation VARCHAR(150) NULL,
  blood_group VARCHAR(5) NULL,
  gender ENUM('male', 'female', 'other') NULL,
  family_members_count INT NULL,
  card_number VARCHAR(50) NULL,
  collected_by: INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_cc_parent
    FOREIGN KEY (parent_id)
    REFERENCES community_card_members(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_card_relations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  relation VARCHAR(100) NOT NULL,
  date_of_birth DATE NULL,
  cnic VARCHAR(25) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_cc_rel_member
    FOREIGN KEY (member_id)
    REFERENCES community_card_members(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE patient_has_service (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_slip_id BIGINT(20) UNSIGNED NOT NULL,
    service_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX (patient_slip_id),
    INDEX (service_id),

    CONSTRAINT fk_phs_slip
        FOREIGN KEY (patient_slip_id) REFERENCES patient_slip(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_phs_service
        FOREIGN KEY (service_id) REFERENCES services(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
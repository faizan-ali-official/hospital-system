import pool from "../config/db.js";

class PatientSlip {
  static async create({
    patient_name,
    doctor_id,
    fees_id = null,
    token_no,
    reference_token_no = null,
    created_by,
    slip_type_id,
    age,
    gender,
    notes = null,
    pharmacy_fees = null,
  }) {
    // If slip_type_name is 'appointment', store appointment fields
    if (slip_type_id === 1) {
      const [result] = await pool.execute(
        `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, token_no, created_by, slip_type_id, age, gender, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient_name,
          doctor_id,
          fees_id,
          token_no,
          created_by,
          slip_type_id,
          age,
          gender,
          new Date(),
        ]
      );
      return result.insertId;
    }
    // If slip_type_name is 'pharmacy', store pharmacy fields
    if (slip_type_id === 2) {
      const [result] = await pool.execute(
        `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, reference_token_no, created_by, slip_type_id, notes, pharmacy_fees,age, gender, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)`,
        [
          patient_name,
          doctor_id,
          1,
          reference_token_no,
          created_by,
          slip_type_id,
          notes,
          pharmacy_fees,
          age,
          gender,
          new Date(),
        ]
      );
      return result.insertId;
    }
    // Default: store all fields
    const [result] = await pool.execute(
      `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, token_no, reference_token_no, created_by, slip_type_id, notes,age,gender,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_name,
        doctor_id,
        fees_id,
        token_no,
        reference_token_no,
        created_by,
        slip_type_id,
        notes,
        age,
        gender,
        new Date(),
      ]
    );
    return result.insertId;
  }

  static async createBulk(slips) {
    const insertedIds = [];

    for (const slip of slips) {
      const token_no = await PatientSlip.getNextTokenNoForToday();

      const slipId = await PatientSlip.create({
        ...slip,
        token_no,
      });

      insertedIds.push(slipId);
    }

    return insertedIds;
  }

  static async findAll({
    startDate,
    endDate,
    doctor_id,
    created_by,
    fees_id,
    slip_type_id,
    status,
    search,
    limit,
    offset,
    deleted,
  } = {}) {
    let sql = `
        SELECT ps.*, 
              d.id as doctor_id, d.doctor_name, d.specialization, 
              f.id as fees_id, f.doctor_fee, st.type_name,
              u.id as created_by, u.name as created_by_name,
              ps.age, ps.gender, ps.deleted_at, ps.delete_note, 
              ud.name as deleted_by
        FROM patient_slip ps
        LEFT JOIN doctors d ON ps.doctor_id = d.id
        LEFT JOIN fees f ON ps.fees_id = f.id
        LEFT JOIN slip_type st ON ps.slip_type_id = st.id
        LEFT JOIN users u ON ps.created_by = u.id
        LEFT JOIN users ud ON ps.delete_by = ud.id
      `;

    const conditions = [];
    const params = [];
    if (startDate && endDate) {
      conditions.push("DATE(ps.created_at) BETWEEN ? AND ?");
      params.push(startDate, endDate);
    } else if (startDate) {
      conditions.push("DATE(ps.created_at) >= ?");
      params.push(startDate);
    } else if (endDate) {
      conditions.push("DATE(ps.created_at) <= ?");
      params.push(endDate);
    }
    if (doctor_id) {
      conditions.push("ps.doctor_id = ?");
      params.push(doctor_id);
    }
    if (created_by) {
      conditions.push("ps.created_by = ?");
      params.push(created_by);
    }
    if (fees_id) {
      conditions.push("ps.fees_id = ?");
      params.push(fees_id);
    }
    if (slip_type_id) {
      conditions.push("ps.slip_type_id = ?");
      params.push(slip_type_id);
    }
    if (status !== undefined) {
      conditions.push("ps.status = ?");
      params.push(status);
    }
    if (search) {
      conditions.push("ps.patient_name LIKE ?");
      params.push(`%${search}%`);
    }
    if (deleted) {
      conditions.push("ps.deleted_at IS NOT NULL");
    } else {
      conditions.push("ps.deleted_at IS NULL");
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY ps.created_at DESC";
    if (limit) {
      sql += " LIMIT ?";
      params.push(Number(limit));
      if (offset) {
        sql += " OFFSET ?";
        params.push(Number(offset));
      }
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT ps.*, 
             d.id as doctor_id, d.doctor_name, d.specialization, 
             f.id as fees_id, f.doctor_fee, st.type_name,
             u.id as created_by, u.name as created_by_name,
             ps.age, ps.gender, ps.deleted_at, ps.delete_note, 
            ud.name as deleted_by
      FROM patient_slip ps
      left JOIN doctors d ON ps.doctor_id = d.id
      left JOIN fees f ON ps.fees_id = f.id
      left JOIN slip_type st ON ps.slip_type_id = st.id
      left JOIN users u ON ps.created_by = u.id
      left JOIN users ud ON ps.created_by = ud.id
      WHERE ps.id = ?
    `,
      [id]
    );
    return rows[0];
  }

  static async update(
    id,
    {
      patient_name,
      doctor_id,
      fees_id,
      status,
      reference_token_no,
      notes,
      // slip_type_id,
      pharmacy_fees,
      gender,
      age,
    }
  ) {
    const fields = [];
    const values = [];

    if (patient_name !== undefined) {
      fields.push("patient_name = ?");
      values.push(patient_name);
    }
    if (doctor_id !== undefined) {
      fields.push("doctor_id = ?");
      values.push(doctor_id);
    }
    if (fees_id !== undefined) {
      fields.push("fees_id = ?");
      values.push(fees_id);
    }
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
    if (reference_token_no !== undefined) {
      fields.push("reference_token_no = ?");
      values.push(reference_token_no);
    }
    if (notes !== undefined) {
      fields.push("notes = ?");
      values.push(notes);
    }
    // if (slip_type_id !== undefined) {
    //   fields.push("slip_type_id = ?");
    //   values.push(slip_type_id);
    // }

    if (pharmacy_fees !== undefined) {
      fields.push("pharmacy_fees = ?");
      values.push(pharmacy_fees);
    }
    if (age !== undefined) {
      fields.push("age = ?");
      values.push(age);
    }
    if (gender !== undefined) {
      fields.push("gender = ?");
      values.push(gender);
    }
    // Always update updated_at timestamp
    fields.push("updated_at = NOW()");

    if (fields.length === 0) return false;

    values.push(id);
    const sql = `UPDATE patient_slip SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);

    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      "UPDATE patient_slip SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, delete_note, deleted_by) {
    const [result] = await pool.execute(
      `UPDATE patient_slip 
     SET deleted_at = NOW(), 
         delete_note = ?, 
         updated_at = NOW(), 
         delete_by = ? 
     WHERE id = ? AND deleted_at IS NULL`,
      [delete_note, deleted_by, id]
    );

    return result.affectedRows > 0;
  }

  static async getNextTokenNoForToday() {
    const [rows] = await pool.execute(
      `SELECT MAX(token_no) as max_token 
     FROM patient_slip 
     WHERE DATE(DATE_SUB(created_at, INTERVAL 2 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 2 HOUR))`
    );

    const maxToken = rows[0]?.max_token;
    return maxToken ? maxToken + 1 : 1;
  }

  static async getSlipAppointmentReport({
    startDate,
    endDate,
    doctor_id,
    created_by,
  }) {
    let sql = `SELECT COUNT(*) as slips_count, COALESCE(SUM(COALESCE(f.doctor_fee,0)),0) as total_amount
      FROM patient_slip ps
      LEFT JOIN fees f ON ps.fees_id = f.id
      WHERE 1=1 AND ps.slip_type_id = 1`;
    const params = [];
    if (startDate) {
      sql += " AND DATE(ps.created_at) >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND DATE(ps.created_at) <= ?";
      params.push(endDate);
    }
    if (doctor_id) {
      sql += " AND ps.doctor_id = ?";
      params.push(doctor_id);
    }
    if (created_by) {
      sql += " AND ps.created_by = ?";
      params.push(created_by);
    }

    const [rows] = await pool.execute(sql, params);
    return rows[0];
  }

  static async getSlipPharmacyReport({
    startDate,
    endDate,
    doctor_id,
    created_by,
  }) {
    let sql = `SELECT COUNT(*) as slips_count, COALESCE(SUM(COALESCE(ps.pharmacy_fees,0)),0) as total_amount
      FROM patient_slip ps
      WHERE 1=1 AND ps.slip_type_id = 2`;
    const params = [];
    if (startDate) {
      sql += " AND DATE(ps.created_at) >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND DATE(ps.created_at) <= ?";
      params.push(endDate);
    }
    if (doctor_id) {
      sql += " AND ps.doctor_id = ?";
      params.push(doctor_id);
    }
    if (created_by) {
      sql += " AND ps.created_by = ?";
      params.push(created_by);
    }

    const [rows] = await pool.execute(sql, params);
    return rows[0];
  }
}

export default PatientSlip;

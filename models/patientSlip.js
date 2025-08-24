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
        `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, token_no, reference_token_no, created_by, slip_type_id, notes, pharmacy_fees,age, gender, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`,
        [
          patient_name,
          doctor_id,
          null,
          token_no,
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
  } = {}) {
    let sql = `
      SELECT ps.*, 
             d.id as doctor_id, d.doctor_name, d.specialization, 
             f.id as fees_id, f.doctor_fee, st.type_name,
             u.id as created_by, u.name as created_by_name,
             ps.age, ps.gender
      FROM patient_slip ps
      left JOIN doctors d ON ps.doctor_id = d.id
      left JOIN fees f ON ps.fees_id = f.id
      left JOIN slip_type st ON ps.slip_type_id = st.id
      left JOIN users u ON ps.created_by = u.id
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
    console.log("sql", sql);
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
             ps.age, ps.gender
      FROM patient_slip ps
      left JOIN doctors d ON ps.doctor_id = d.id
      left JOIN fees f ON ps.fees_id = f.id
      left JOIN slip_type st ON ps.slip_type_id = st.id
      left JOIN users u ON ps.created_by = u.id
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

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM patient_slip WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getNextTokenNoForToday() {
    const [rows] = await pool.execute(
      `SELECT MAX(token_no) as max_token FROM patient_slip WHERE DATE(created_at) = CURDATE()`
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

import pool from '../config/db.js';

class PatientSlip {
  static async create({ patient_name, doctor_id, fees_id, token_no, reference_token_no = null, created_by }) {
    const [result] = await pool.execute(
      'INSERT INTO patient_slip (patient_name, doctor_id, fees_id, token_no, reference_token_no, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_name, doctor_id, fees_id, token_no, reference_token_no, created_by]
    );
    return result.insertId;
  }

  static async findAll({ startDate, endDate, doctor_id, created_by, fees_id, status, search, limit, offset } = {}) {
    let sql = `
      SELECT ps.*, 
             d.id as doctor_id, d.doctor_name, d.specialization, 
             f.id as fees_id, f.doctor_fee
      FROM patient_slip ps
      JOIN doctors d ON ps.doctor_id = d.id
      JOIN fees f ON ps.fees_id = f.id
    `;
    const conditions = [];
    const params = [];
    if (startDate && endDate) {
      conditions.push('DATE(ps.created_at) BETWEEN ? AND ?');
      params.push(startDate, endDate);
    } else if (startDate) {
      conditions.push('DATE(ps.created_at) >= ?');
      params.push(startDate);
    } else if (endDate) {
      conditions.push('DATE(ps.created_at) <= ?');
      params.push(endDate);
    }
    if (doctor_id) {
      conditions.push('ps.doctor_id = ?');
      params.push(doctor_id);
    }
    if (created_by) {
      conditions.push('ps.created_by = ?');
      params.push(created_by);
    }
    if (fees_id) {
      conditions.push('ps.fees_id = ?');
      params.push(fees_id);
    }
    if (status !== undefined) {
      conditions.push('ps.status = ?');
      params.push(status);
    }
    if (search) {
      conditions.push('ps.patient_name LIKE ?');
      params.push(`%${search}%`);
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY ps.created_at DESC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
      if (offset) {
        sql += ' OFFSET ?';
        params.push(Number(offset));
      }
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT ps.*, 
             d.id as doctor_id, d.doctor_name, d.specialization, 
             f.id as fees_id, f.doctor_fee
      FROM patient_slip ps
      JOIN doctors d ON ps.doctor_id = d.id
      JOIN fees f ON ps.fees_id = f.id
      WHERE ps.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, { patient_name, doctor_id, fees_id, status, reference_token_no }) {
    const fields = [];
    const values = [];
    if (patient_name !== undefined) {
      fields.push('patient_name = ?');
      values.push(patient_name);
    }
    if (doctor_id !== undefined) {
      fields.push('doctor_id = ?');
      values.push(doctor_id);
    }
    if (fees_id !== undefined) {
      fields.push('fees_id = ?');
      values.push(fees_id);
    }
    // if (token_no !== undefined) {
    //   fields.push('token_no = ?');
    //   values.push(token_no);
    // }
    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }
    if (reference_token_no !== undefined) {
      fields.push('reference_token_no = ?');
      values.push(reference_token_no);
    }
    // if (created_by !== undefined) {
    //   fields.push('created_by = ?');
    //   values.push(created_by);
    // }
    // Always update updated_at
    fields.push('updated_at = NOW()');
    if (fields.length === 0) return false;
    values.push(id);
    const sql = `UPDATE patient_slip SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute('UPDATE patient_slip SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM patient_slip WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getNextTokenNoForToday() {
    const [rows] = await pool.execute(
      `SELECT MAX(token_no) as max_token FROM patient_slip WHERE DATE(created_at) = CURDATE()`
    );
    const maxToken = rows[0]?.max_token;
    return maxToken ? maxToken + 1 : 1;
  }
}

export default PatientSlip; 
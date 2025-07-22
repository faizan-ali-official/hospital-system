import pool from "../config/db.js";

class Doctor {
  static async create({ doctor_name, specialization }) {
    const [result] = await pool.execute(
      "INSERT INTO doctors (doctor_name, specialization,updated_at) VALUES (?, ?, ?)",
      [doctor_name, specialization, new Date()]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute("SELECT * FROM doctors");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM doctors WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async update(id, { doctor_name, specialization }) {
    const fields = [];
    const values = [];
    if (doctor_name !== undefined) {
      fields.push("doctor_name = ?");
      values.push(doctor_name);
    }
    if (specialization !== undefined) {
      fields.push("specialization = ?");
      values.push(specialization);
    }
    fields.push("updated_at = NOW()");
    if (fields.length === 0) return false;
    values.push(id);
    const sql = `UPDATE doctors SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM doctors WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

export default Doctor;

import pool from "../config/db.js";

class Services {
  static async create({ name, fees }) {
    const [result] = await pool.execute(
      "INSERT INTO services (service_name, service_fees, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [name, fees, new Date(), new Date()]
    );
    return result.insertId;
  }

  static async findByName(name) {
    const [rows] = await pool.execute(
      `SELECT * FROM services WHERE service_name Like ?`,
      [`%${name}%`]
    );
    return rows[0];
  }

  static async updateRefreshToken(id, refreshToken) {
    await pool.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      id,
    ]);
  }

  static async findAll() {
    const [rows] = await pool.execute("SELECT * FROM services");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM services WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async update(id, { name, fees }) {
    // Only update fields that are provided
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push("service_name = ?");
      values.push(name);
    }
    if (fees !== undefined) {
      fields.push("service_fees = ?");
      values.push(fees);
    }
    fields.push("updated_at = NOW()");

    if (fields.length === 0) return false;
    values.push(id);
    const sql = `UPDATE services SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM services WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

export default Services;

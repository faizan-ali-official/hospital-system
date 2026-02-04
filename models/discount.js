import pool from "../config/db.js";

class Discounts {
  static async create({ name, percentage }) {
    const [result] = await pool.execute(
      "INSERT INTO discounts (discount_name, discount_percentage, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [name, percentage, new Date(), new Date()]
    );
    return result.insertId;
  }

  static async findByName(name) {
    const [rows] = await pool.execute(
      `SELECT * FROM discounts WHERE discount_name LIKE ?`,
      [`%${name}%`]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.execute("SELECT * FROM discounts");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM discounts WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async update(id, { name, percentage }) {
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push("discount_name = ?");
      values.push(name);
    }
    if (percentage !== undefined) {
      fields.push("discount_percentage = ?");
      values.push(percentage);
    }
    fields.push("updated_at = NOW()");

    if (fields.length === 1) return false;
    values.push(id);
    const sql = `UPDATE discounts SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM discounts WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

export default Discounts;

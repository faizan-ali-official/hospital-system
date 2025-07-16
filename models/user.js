import pool from '../config/db.js';

class User {
  static async create({ name, email, password, roleId }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, password, roleId]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT users.*, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.email = ?`,
      [email]
    );
    return rows[0];
  }

  static async updateRefreshToken(id, refreshToken) {
    await pool.execute(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, id]
    );
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT u.id, u.name as user_name, u.email, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT u.id, u.name as user_name, u.email, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?', [id]);
    return rows[0];
  }

  static async update(id, { name, email, password, roleId }) {
    // Only update fields that are provided
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      values.push(email);
    }
    if (password !== undefined) {
      fields.push('password = ?');
      values.push(password);
    }
    if (roleId !== undefined) {
      fields.push('role_id = ?');
      values.push(roleId);
    }
    if (fields.length === 0) return false;
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default User; 
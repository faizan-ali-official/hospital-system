import pool from '../config/db.js';

class Fees {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM fees');
    return rows;
  }
}

export default Fees; 
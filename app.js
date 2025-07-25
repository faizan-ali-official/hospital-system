import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import pool from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Test DB connection before starting server
(async () => {
  try {
    await pool.getConnection();
    console.log('Connected to MySQL database.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1);
  }
})();

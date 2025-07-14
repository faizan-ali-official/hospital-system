import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      // Store refresh token in DB
      await User.updateRefreshToken(user.id, refreshToken);
      return res.json({ accessToken, refreshToken });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required.' });
      }
      let payload;
      try {
        payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      } catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }
      const user = await User.findByEmail(payload.email);
      if (!user || user.refresh_token !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }
      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required.' });
      }
      let payload;
      try {
        payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      } catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }
      const user = await User.findByEmail(payload.email);
      if (!user) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }
      await User.updateRefreshToken(user.id, null);
      return res.json({ message: 'Logged out successfully.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  }
}

export default AuthController; 
import User from "../models/user.js";
import bcrypt from "bcryptjs";

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, password, roleId } = req.body;
      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create({
        name,
        email,
        password: hashedPassword,
        roleId
      });
      return res.status(201).json({ id: userId, name, email });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await User.findAll();
      // Do not return passwords or sensitive info
      const safeUsers = users.map(({ id, user_name, email, role_name }) => ({
        id,
        name: user_name,
        email,
        role_name
      }));
      return res.json(safeUsers);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const { user_name, email, role_name } = user;
      return res.json({ id, name: user_name, email, role_name });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, password , roleId} = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
      const updated = await User.update(id, {
        name,
        password: hashedPassword,
        roleId
      });
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }
      return res.json({ message: "User updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      await User.delete(id);
      return res.json({ message: "User deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }
}

export default UserController;

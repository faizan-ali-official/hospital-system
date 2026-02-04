import Discount from "../models/discount.js";

class DiscountController {
  static async createDiscount(req, res) {
    try {
      const { name, percentage } = req.body;
      const existingDiscount = await Discount.findByName(name);
      if (existingDiscount) {
        return res
          .status(409)
          .json({ message: "Discount with this name already exists." });
      }

      const discountId = await Discount.create({
        name,
        percentage
      });

      return res
        .status(201)
        .json({
          id: discountId,
          discount_name: name,
          discount_percentage: percentage
        });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getDiscounts(req, res) {
    try {
      const discounts = await Discount.findAll();
      return res.json(discounts);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getDiscountById(req, res) {
    try {
      const { id } = req.params;
      const discount = await Discount.findById(id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found." });
      }
      return res.json({ discount });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async updateDiscount(req, res) {
    try {
      const { id } = req.params;
      const { name, percentage } = req.body;
      const discount = await Discount.findById(id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found." });
      }
      const updated = await Discount.update(id, {
        name,
        percentage
      });
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }
      const updatedDiscount = await Discount.findById(id);
      return res.json({
        message: "Discount updated successfully.",
        updatedDiscount
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async deleteDiscount(req, res) {
    try {
      const { id } = req.params;
      const discount = await Discount.findById(id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found." });
      }
      await Discount.delete(id);
      return res.json({ message: "Discount deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }
}

export default DiscountController;

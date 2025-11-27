import Service from "../models/service.js";

class ServiceController {
  static async createService(req, res) {
    try {
      const { name, fees } = req.body;
      // Check if service already exists
      const existingService = await Service.findByName(name);
      if (existingService) {
        return res
          .status(409)
          .json({ message: "Service with this name already exists." });
      }

      const ServiceId = await Service.create({
        name,
        fees
      });

      return res
        .status(201)
        .json({ id: ServiceId, service_name: name, service_fees: fees });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getServices(req, res) {
    try {
      const services = await Service.findAll();
      return res.json(services);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }
      return res.json({ service });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const { name, fees } = req.body;
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }
      const updated = await Service.update(id, {
        name,
        fees
      });
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }
      const updatedService = await Service.findById(id);
      return res.json({
        message: "Service updated successfully.",
        updatedService
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }
      await Service.delete(id);
      return res.json({ message: "Service deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }
}

export default ServiceController;

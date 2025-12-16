import CommunityCardMember from "../models/communityCardMember.js";

class CommunityCardController {
  static async createMember(req, res) {
    try {
      const payload = req.body;

      if (payload.parent_id) {
        const parent = await CommunityCardMember.findById(payload.parent_id);
        if (!parent) {
          return res.status(400).json({ message: "Parent record not found." });
        }
      }

      const id = await CommunityCardMember.create({
        ...payload,
        collected_by: req.user.id
      });
      const created = await CommunityCardMember.findById(id);
      return res
        .status(201)
        .json({ ...created, parent_id: payload.parent_id ?? null });
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getMembers(req, res) {
    try {
      const { parent_id, search } = req.query;
      let parentFilter = undefined;

      if (parent_id === "null") {
        parentFilter = null;
      } else if (parent_id !== undefined) {
        const parsed = parseInt(parent_id, 10);
        if (Number.isNaN(parsed)) {
          return res
            .status(400)
            .json({ message: "parent_id must be an integer or 'null'." });
        }
        parentFilter = parsed;
      }

      const members = await CommunityCardMember.findAll({
        parent_id: parentFilter,
        search: search ? search.trim() : undefined
      });
      return res.json(members);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async getMemberById(req, res) {
    try {
      const { id } = req.params;
      const member = await CommunityCardMember.findById(id);
      if (!member) {
        return res.status(404).json({ message: "Record not found." });
      }
      return res.json(member);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async updateMember(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const existing = await CommunityCardMember.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Record not found." });
      }

      if (payload.parent_id !== undefined) {
        if (Number(id) === Number(payload.parent_id)) {
          return res.status(400).json({
            message: "parent_id cannot be the same as the record id."
          });
        }
        if (payload.parent_id !== null) {
          const parent = await CommunityCardMember.findById(payload.parent_id);
          if (!parent) {
            return res
              .status(400)
              .json({ message: "Parent record not found." });
          }
        }
      }

      const updated = await CommunityCardMember.update(id, payload);
      if (!updated) {
        return res.status(400).json({ message: "Nothing to update." });
      }

      const member = await CommunityCardMember.findById(id);
      return res.json(member);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }

  static async deleteMember(req, res) {
    try {
      const { id } = req.params;
      const existing = await CommunityCardMember.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Record not found." });
      }
      await CommunityCardMember.delete(id);
      return res.json({ message: "Record deleted successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Server error. " + err.message });
    }
  }

  static async searchByCnic(req, res) {
    try {
      const { cnic } = req.query;
      if (!cnic || !cnic.trim()) {
        return res
          .status(400)
          .json({ message: "cnic query param is required." });
      }
      const results = await CommunityCardMember.searchByCnic(cnic.trim());
      console.log(results);
      return res.json(results);
    } catch (err) {
      return res.status(500).json({ message: "Server error." });
    }
  }
}

export default CommunityCardController;

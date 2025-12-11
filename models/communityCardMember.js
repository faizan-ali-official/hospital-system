import pool from "../config/db.js";
import CommunityCardRelation from "./communityCardRelation.js";

class CommunityCardMember {
  static async create(data) {
    const {
      parent_id,
      full_name,
      guardian_name,
      cnic,
      cast,
      current_address,
      permanent_address,
      education,
      occupation,
      gender,
      blood_group,
      contact_number,
      family_members_count,
      date_of_birth,
      card_number,
      relations,
      collected_by
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO community_card_members (
        parent_id,
        full_name,
        guardian_name,
        cnic,
        cast,
        current_address,
        permanent_address,
        education,
        occupation,
        gender,
        blood_group,
        contact_number,
        family_members_count,
        date_of_birth,
        card_number,
        collected_by,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parent_id ?? null,
        full_name,
        guardian_name ?? null,
        cnic ?? null,
        cast ?? null,
        current_address ?? null,
        permanent_address ?? null,
        education ?? null,
        occupation ?? null,
        gender,
        blood_group ?? null,
        contact_number ?? null,
        family_members_count ?? null,
        date_of_birth ?? null,
        card_number ?? null,
        collected_by ?? null,
        new Date(),
      ]
    );

    const memberId = result.insertId;
    if (Array.isArray(relations) && relations.length) {
      await CommunityCardRelation.createMany(memberId, relations);
    }

    return memberId;
  }

  static async findAll(filters = {}) {
    const { parent_id, search } = filters;
    let sql = "SELECT * FROM community_card_members";
    const conditions = [];
    const values = [];

    if (parent_id !== undefined) {
      conditions.push(
        parent_id === null ? "parent_id IS NULL" : "parent_id = ?"
      );
      if (parent_id !== null) values.push(parent_id);
    }

    if (search) {
      conditions.push("(full_name LIKE ? OR cnic LIKE ?)");
      const term = `%${search}%`;
      values.push(term, term);
    }

    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await pool.execute(sql, values);
    const ids = rows.map((r) => r.id);
    const relationMap = await CommunityCardRelation.getByMemberIds(ids);
    return rows.map((row) => ({
      ...row,
      relations: relationMap[row.id] || [],
    }));
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM community_card_members WHERE id = ?",
      [id]
    );
    const member = rows[0];
    if (!member) return undefined;

    const idsForRelations = [member.id];
    if (member.parent_id) idsForRelations.push(member.parent_id);
    const relationMap = await CommunityCardRelation.getByMemberIds(
      idsForRelations
    );

    let parent = null;
    if (member.parent_id) {
      const [parentRows] = await pool.execute(
        "SELECT * FROM community_card_members WHERE id = ?",
        [member.parent_id]
      );
      parent = parentRows[0] || null;
      if (parent) {
        parent = {
          ...parent,
          relations: relationMap[parent.id] || [],
        };
      }
    }

    return {
      ...member,
      relations: relationMap[member.id] || [],
      parent,
    };
  }

  static async searchByCnic(term) {
    const like = `%${term}%`;
    const [rows] = await pool.execute(
      "SELECT id, cnic, full_name FROM community_card_members WHERE cnic LIKE ?",
      [like]
    );
    return rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    const updatableFields = {
      parent_id: "parent_id",
      full_name: "full_name",
      guardian_name: "guardian_name",
      cnic: "cnic",
      current_address: "current_address",
      permanent_address: "permanent_address",
      education: "education",
      occupation: "occupation",
      cast: "cast",
      gender: "gender",
      blood_group: "blood_group",
      contact_number: "contact_number",
      family_members_count: "family_members_count",
      date_of_birth: "date_of_birth",
      card_number: "card_number",
    };

    Object.entries(updatableFields).forEach(([key, column]) => {
      if (data[key] !== undefined) {
        fields.push(`${column} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return false;

    fields.push("updated_at = NOW()");
    values.push(id);

    const sql = `UPDATE community_card_members SET ${fields.join(
      ", "
    )} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);
    if (!result.affectedRows) return false;

    if (data.relations !== undefined) {
      await CommunityCardRelation.deleteByMemberId(id);
      if (Array.isArray(data.relations) && data.relations.length) {
        await CommunityCardRelation.createMany(id, data.relations);
      }
    }

    return true;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM community_card_members WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default CommunityCardMember;


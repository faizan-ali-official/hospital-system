import pool from "../config/db.js";

class CommunityCardRelation {
  static async createMany(memberId, relations = []) {
    if (!relations.length) return;
    const values = relations.map((rel) => [
      memberId,
      rel.full_name,
      rel.relation,
      rel.date_of_birth ?? null,
      rel.cnic ?? null,
      new Date(),
    ]);
    await pool.query(
      `INSERT INTO community_card_relations 
        (member_id, full_name, relation, date_of_birth, cnic, updated_at) 
       VALUES ?`,
      [values]
    );
  }

  static async deleteByMemberId(memberId) {
    await pool.execute(
      "DELETE FROM community_card_relations WHERE member_id = ?",
      [memberId]
    );
  }

  static async getByMemberIds(ids = []) {
    if (!ids.length) return {};
    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await pool.query(
      `SELECT member_id, full_name, relation, date_of_birth, cnic 
         FROM community_card_relations 
        WHERE member_id IN (${placeholders})`,
      ids
    );
    const map = {};
    rows.forEach((row) => {
      if (!map[row.member_id]) map[row.member_id] = [];
      map[row.member_id].push({
        full_name: row.full_name,
        relation: row.relation,
        date_of_birth: row.date_of_birth,
        cnic: row.cnic,
      });
    });
    return map;
  }
}

export default CommunityCardRelation;


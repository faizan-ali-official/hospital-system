import pool from "../config/db.js";

class PatientSlip {
  static async create({
    patient_name,
    doctor_id,
    fees_id = null,
    token_no,
    reference_token_no = null,
    created_by,
    slip_type_id,
    age,
    gender,
    notes = null,
    pharmacy_fees = null,
    // is_card_holder = false,
    discount_id = null,
  }) {
    // If slip_type_name is 'appointment', store appointment fields
    if (slip_type_id === 1) {
      const [result] = await pool.execute(
        `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, token_no, created_by, slip_type_id, age, gender, discount_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient_name,
          doctor_id,
          fees_id,
          token_no,
          created_by,
          slip_type_id,
          age,
          gender,
          // is_card_holder,
          discount_id,
          new Date(),
        ]
      );
      return result.insertId;
    }
    // If slip_type_name is 'pharmacy', store pharmacy fields
    if (slip_type_id === 2) {
      const [result] = await pool.execute(
        `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, reference_token_no, created_by, slip_type_id, notes, pharmacy_fees, age, gender, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient_name,
          doctor_id,
          1,
          reference_token_no,
          created_by,
          slip_type_id,
          notes,
          pharmacy_fees,
          age,
          gender,
          // is_card_holder,
          new Date(),
        ]
      );
      return result.insertId;
    }
    // Default: store all fields
    const [result] = await pool.execute(
      `INSERT INTO patient_slip (patient_name, doctor_id, fees_id, token_no, reference_token_no, created_by, slip_type_id, notes, age, gender, discount_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_name,
        doctor_id,
        fees_id,
        token_no,
        reference_token_no,
        created_by,
        slip_type_id,
        notes,
        age,
        gender,
        discount_id,
        new Date(),
      ]
    );
    return result.insertId;
  }

  static async createBulk(slips) {
    const insertedIds = [];

    for (const slip of slips) {
      const token_no = await PatientSlip.getNextTokenNoForToday();

      const slipId = await PatientSlip.create({
        ...slip,
        token_no,
      });

      insertedIds.push(slipId);
    }

    return insertedIds;
  }

  static async findAll({
    id,
    startDate,
    endDate,
    doctor_id,
    created_by,
    fees_id,
    slip_type_id,
    status,
    search,
    limit,
    offset,
    deleted,
    discount_id,
  } = {}) {
    let sql = `
        SELECT ps.*, 
              d.id as doctor_id, d.doctor_name, d.specialization, 
              f.id as fees_id, f.doctor_fee, st.type_name,
              u.id as created_by, u.username as created_by_name,
              ps.age, ps.gender, ps.deleted_at, ps.delete_note, 
              ud.username as deleted_by,
              s.id AS service_id, s.service_name, s.service_fees,
              disc.id AS discount_id, disc.discount_name, disc.discount_percentage
        FROM patient_slip ps
        LEFT JOIN doctors d ON ps.doctor_id = d.id
        LEFT JOIN fees f ON ps.fees_id = f.id
        LEFT JOIN slip_type st ON ps.slip_type_id = st.id
        LEFT JOIN users u ON ps.created_by = u.id
        LEFT JOIN users ud ON ps.delete_by = ud.id
        LEFT JOIN patient_has_service phs ON phs.patient_slip_id = ps.id
        LEFT JOIN services s ON s.id = phs.service_id
        LEFT JOIN discounts disc ON ps.discount_id = disc.id
      `;

    const conditions = [];
    const params = [];
    if (id) {
      conditions.push("ps.id = ?");
      params.push(id);
    }
    if (startDate) {
      conditions.push("DATE(ps.created_at) >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("DATE(ps.created_at) <= ?");
      params.push(endDate);
    }
    if (doctor_id) {
      conditions.push("ps.doctor_id = ?");
      params.push(doctor_id);
    }
    if (created_by) {
      conditions.push("ps.created_by = ?");
      params.push(created_by);
    }
    if (fees_id) {
      conditions.push("ps.fees_id = ?");
      params.push(fees_id);
    }
    if (slip_type_id) {
      conditions.push("ps.slip_type_id = ?");
      params.push(slip_type_id);
    }
    if (status !== undefined) {
      conditions.push("ps.status = ?");
      params.push(status);
    }
    if (search) {
      conditions.push("ps.patient_name LIKE ?");
      params.push(`%${search}%`);
    }
    if (deleted === "true") {
      conditions.push("ps.deleted_at IS NOT NULL");
    } else if (deleted === "false" || deleted === undefined || !deleted) {
      conditions.push("ps.deleted_at IS NULL");
    }
    if (discount_id) {
      conditions.push("ps.discount_id = ?");
      params.push(Number(discount_id));
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY ps.created_at DESC";
    if (limit) {
      sql += " LIMIT ?";
      params.push(Number(limit));
      if (offset) {
        sql += " OFFSET ?";
        params.push(Number(offset));
      }
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
  }
  static async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT ps.*, 
             d.id AS doctor_id, d.doctor_name, d.specialization, 
             f.id AS fees_id, f.doctor_fee, st.type_name AS slip_type_name,
             u.id AS created_by, u.username AS created_by_name,
             ps.age, ps.gender, ps.deleted_at, ps.delete_note, 
             ud.username AS deleted_by_name,
             s.id AS service_id, s.service_name, s.service_fees,
             disc.id AS discount_id, disc.discount_name, disc.discount_percentage
      FROM patient_slip ps
      LEFT JOIN doctors d ON ps.doctor_id = d.id
      LEFT JOIN fees f ON ps.fees_id = f.id
      LEFT JOIN slip_type st ON ps.slip_type_id = st.id
      LEFT JOIN users u ON ps.created_by = u.id
      LEFT JOIN users ud ON ps.delete_by = ud.id
      LEFT JOIN patient_has_service phs ON phs.patient_slip_id = ps.id
      LEFT JOIN services s ON s.id = phs.service_id
      LEFT JOIN discounts disc ON ps.discount_id = disc.id
      WHERE ps.id = ?
      `,
      [id]
    );
    if (!rows.length) return null;

    const slip = { ...rows[0], services: [] };

    rows.forEach((row) => {
      if (row.service_id) {
        slip.services.push({
          id: row.service_id,
          name: row.service_name,
          fees: row.service_fees,
        });
      }
    });

    return slip;
  }

  static async update(
    id,
    {
      patient_name,
      doctor_id,
      fees_id,
      status,
      reference_token_no,
      notes,
      // slip_type_id,
      pharmacy_fees,
      gender,
      age,
      service_id,
      // is_card_holder,
      discount_id,
    }
  ) {
    const fields = [];
    const values = [];

    if (patient_name !== undefined) {
      fields.push("patient_name = ?");
      values.push(patient_name);
    }
    if (doctor_id !== undefined) {
      fields.push("doctor_id = ?");
      values.push(doctor_id);
    }
    if (fees_id !== undefined) {
      fields.push("fees_id = ?");
      values.push(fees_id);
    }
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
    if (reference_token_no !== undefined) {
      fields.push("reference_token_no = ?");
      values.push(reference_token_no);
    }
    if (notes !== undefined) {
      fields.push("notes = ?");
      values.push(notes);
    }
    // if (is_card_holder !== undefined) {
    //   fields.push("is_card_holder = ?");
    //   values.push(is_card_holder);
    // }
    if (discount_id !== undefined) {
      fields.push("discount_id = ?");
      values.push(discount_id);
    }
    // if (slip_type_id !== undefined) {
    //   fields.push("slip_type_id = ?");
    //   values.push(slip_type_id);
    // }

    if (pharmacy_fees !== undefined) {
      fields.push("pharmacy_fees = ?");
      values.push(pharmacy_fees);
    }
    if (age !== undefined) {
      fields.push("age = ?");
      values.push(age);
    }
    if (gender !== undefined) {
      fields.push("gender = ?");
      values.push(gender);
    }
    // Always update updated_at timestamp
    fields.push("updated_at = NOW()");

    if (fields.length === 0) return false;

    values.push(id);
    const sql = `UPDATE patient_slip SET ${fields.join(", ")} WHERE id = ?`;
    // const [result] = await pool.execute(sql, values);

    // return result.affectedRows > 0;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) Update patient_slip
      const [result] = await conn.execute(sql, values);

      if (result.affectedRows === 0) {
        await conn.rollback();
        return false;
      }

      // 2) Delete previous services
      await conn.execute(
        `DELETE FROM patient_has_service WHERE patient_slip_id = ?`,
        [id]
      );

      // 3) Insert new services (if provided)
      if (Array.isArray(service_id) && service_id.length > 0) {
        const valuesToInsert = service_id.map((sid) => [id, sid]);
        await conn.query(
          `INSERT INTO patient_has_service (patient_slip_id, service_id) VALUES ?`,
          [valuesToInsert]
        );
      }

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      "UPDATE patient_slip SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, delete_note, deleted_by) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1) Soft delete the patient_slip
      const [result] = await conn.execute(
        `UPDATE patient_slip 
       SET deleted_at = NOW(), 
           delete_note = ?, 
           updated_at = NOW(), 
           delete_by = ? 
       WHERE id = ? AND deleted_at IS NULL`,
        [delete_note, deleted_by, id]
      );

      // If slip not updated → no delete
      if (result.affectedRows === 0) {
        await conn.rollback();
        return false;
      }

      // 2) Delete related service records
      await conn.execute(
        `DELETE FROM patient_has_service WHERE patient_slip_id = ?`,
        [id]
      );

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async getNextTokenNoForToday() {
    const [rows] = await pool.execute(
      `SELECT MAX(token_no) as max_token 
     FROM patient_slip 
     WHERE DATE(DATE_SUB(created_at, INTERVAL 2 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 2 HOUR))`
    );

    const maxToken = rows[0]?.max_token;
    return maxToken ? maxToken + 1 : 1;
  }

  static async getSlipAppointmentReport({
    startDate,
    endDate,
    doctor_id,
    created_by,
  }) {
    let sql = `SELECT 
      COUNT(*) as slips_count, 
      ROUND(COALESCE(SUM(
        COALESCE(f.doctor_fee, 0) * (1 - COALESCE(disc.discount_percentage, 0) / 100)
      ), 0), 2) as total_amount
      FROM patient_slip ps
      LEFT JOIN fees f ON ps.fees_id = f.id
      LEFT JOIN discounts disc ON ps.discount_id = disc.id
      WHERE 1=1 AND ps.slip_type_id = 1 and ps.deleted_at is null`;
    const params = [];
    if (startDate) {
      sql += " AND DATE(ps.created_at) >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND DATE(ps.created_at) <= ?";
      params.push(endDate);
    }
    if (doctor_id) {
      sql += " AND ps.doctor_id = ?";
      params.push(doctor_id);
    }
    if (created_by) {
      sql += " AND ps.created_by = ?";
      params.push(created_by);
    }

    const [rows] = await pool.execute(sql, params);
    return rows[0];
  }

  static async getSlipPharmacyReport({
    startDate,
    endDate,
    doctor_id,
    created_by,
  }) {
    let sql = `SELECT 
    COUNT(*) AS slips_count,
    COALESCE(SUM(total_per_slip), 0) AS total_amount
    FROM (
        SELECT 
            ps.id,
            COALESCE(CAST(ps.pharmacy_fees AS DECIMAL),0) + 
            COALESCE(SUM(s.service_fees),0) AS total_per_slip
        FROM patient_slip ps
        LEFT JOIN patient_has_service phs ON phs.patient_slip_id = ps.id
        LEFT JOIN services s ON s.id = phs.service_id
        WHERE ps.slip_type_id = 2 and ps.deleted_at is null
    `;
    const params = [];
    if (startDate) {
      sql += " AND DATE(ps.created_at) >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND DATE(ps.created_at) <= ?";
      params.push(endDate);
    }
    if (doctor_id) {
      sql += " AND ps.doctor_id = ?";
      params.push(doctor_id);
    }
    if (created_by) {
      sql += " AND ps.created_by = ?";
      params.push(created_by);
    }
    sql += ` GROUP BY ps.id, ps.pharmacy_fees ) AS sub`;

    const [rows] = await pool.execute(sql, params);
    return rows[0];
  }

  static async addServices(patient_slip_id, service_ids) {
    const values = service_ids.map((serviceId) => [patient_slip_id, serviceId]);

    const [result] = await pool.query(
      `INSERT INTO patient_has_service (patient_slip_id, service_id)
     VALUES ?`,
      [values]
    );

    return result.affectedRows > 0;
  }
}

export default PatientSlip;

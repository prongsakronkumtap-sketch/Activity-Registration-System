import pool from "../config/db.js";

const OPEN_STATUS = "เปิดรับสมัคร";
const VALID_STATUS = [OPEN_STATUS, "ปิดรับสมัคร"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (value) => typeof value !== "string" || value.trim() === "";

function parseId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// คืนข้อความ error ถ้าข้อมูลกิจกรรมไม่ถูกต้อง ถ้าถูกต้องคืน null
function validateActivity(body = {}) {
  if (isBlank(body.title)) return "กรุณากรอกชื่อกิจกรรม";
  if (isBlank(body.activity_date) || !DATE_PATTERN.test(body.activity_date)) {
    return "กรุณาระบุวันที่ในรูปแบบ YYYY-MM-DD";
  }
  if (isBlank(body.location)) return "กรุณากรอกสถานที่";
  if (body.status !== undefined && !VALID_STATUS.includes(body.status)) {
    return "สถานะไม่ถูกต้อง";
  }
  return null;
}

async function findActivity(id) {
  const [rows] = await pool.query("SELECT * FROM activities WHERE id = ?", [id]);
  return rows[0] || null;
}

// GET /api/activities
export async function getActivities(req, res) {
  const [rows] = await pool.query(
    `SELECT a.*,
            (SELECT COUNT(*) FROM participants p WHERE p.activity_id = a.id) AS participant_count
     FROM activities a
     ORDER BY a.activity_date ASC, a.id ASC`
  );
  res.json({ message: "โหลดข้อมูลสำเร็จ", data: rows });
}

// GET /api/activities/:id
export async function getActivityById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "รหัสกิจกรรมไม่ถูกต้อง" });

  const activity = await findActivity(id);
  if (!activity) return res.status(404).json({ message: "ไม่พบข้อมูลกิจกรรม" });

  res.json({ message: "โหลดข้อมูลสำเร็จ", data: activity });
}

// POST /api/activities
export async function createActivity(req, res) {
  const error = validateActivity(req.body);
  if (error) return res.status(400).json({ message: error });

  const { title, description = "", activity_date, location, status = OPEN_STATUS } = req.body;
  const [result] = await pool.query(
    `INSERT INTO activities (title, description, activity_date, location, status)
     VALUES (?, ?, ?, ?, ?)`,
    [title.trim(), description, activity_date, location.trim(), status]
  );

  const created = await findActivity(result.insertId);
  res.status(201).json({ message: "เพิ่มกิจกรรมสำเร็จ", data: created });
}

// PUT /api/activities/:id
export async function updateActivity(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "รหัสกิจกรรมไม่ถูกต้อง" });

  const error = validateActivity(req.body);
  if (error) return res.status(400).json({ message: error });

  const existing = await findActivity(id);
  if (!existing) return res.status(404).json({ message: "ไม่พบข้อมูลกิจกรรม" });

  const {
    title,
    description = "",
    activity_date,
    location,
    status = existing.status,
  } = req.body;

  await pool.query(
    `UPDATE activities
     SET title = ?, description = ?, activity_date = ?, location = ?, status = ?
     WHERE id = ?`,
    [title.trim(), description, activity_date, location.trim(), status, id]
  );

  const updated = await findActivity(id);
  res.json({ message: "แก้ไขกิจกรรมสำเร็จ", data: updated });
}

// DELETE /api/activities/:id
export async function deleteActivity(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "รหัสกิจกรรมไม่ถูกต้อง" });

  const existing = await findActivity(id);
  if (!existing) return res.status(404).json({ message: "ไม่พบข้อมูลกิจกรรม" });

  await pool.query("DELETE FROM activities WHERE id = ?", [id]);
  res.json({ message: "ลบกิจกรรมสำเร็จ", data: { id } });
}

// POST /api/activities/:id/participants
export async function registerParticipant(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "รหัสกิจกรรมไม่ถูกต้อง" });

  const { student_id, student_name, email } = req.body || {};
  if (isBlank(student_id) || isBlank(student_name) || isBlank(email)) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง" });
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({ message: "รูปแบบอีเมลไม่ถูกต้อง" });
  }

  const activity = await findActivity(id);
  if (!activity) return res.status(404).json({ message: "ไม่พบข้อมูลกิจกรรม" });
  if (activity.status !== OPEN_STATUS) {
    return res.status(400).json({ message: "กิจกรรมนี้ปิดรับสมัครแล้ว" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO participants (activity_id, student_id, student_name, email)
       VALUES (?, ?, ?, ?)`,
      [id, student_id.trim(), student_name.trim(), email.trim()]
    );
    res.status(201).json({
      message: "ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ",
      data: { id: result.insertId, activity_id: id },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "รหัสนักศึกษานี้ลงทะเบียนกิจกรรมนี้แล้ว" });
    }
    throw err;
  }
}

// GET /api/activities/:id/participants
export async function getParticipants(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "รหัสกิจกรรมไม่ถูกต้อง" });

  const activity = await findActivity(id);
  if (!activity) return res.status(404).json({ message: "ไม่พบข้อมูลกิจกรรม" });

  const [rows] = await pool.query(
    `SELECT id, student_id, student_name, email, created_at
     FROM participants
     WHERE activity_id = ?
     ORDER BY created_at ASC, id ASC`,
    [id]
  );
  res.json({ message: "โหลดข้อมูลสำเร็จ", data: rows });
}

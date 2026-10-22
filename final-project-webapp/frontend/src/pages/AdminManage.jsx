// src/pages/AdminManage.jsx
import { useState, useEffect } from "react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getParticipants,
} from "../services/api";
import StatusMessage from "../components/StatusMessage";

const EMPTY_FORM = {
  title: "",
  description: "",
  activity_date: "",
  location: "",
  status: "เปิดรับสมัคร",
};

const fieldStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "#fff",
  color: "#202124",
  boxSizing: "border-box",
  width: "100%",
};

const cellStyle = { padding: "12px", color: "#202124" };

function AdminManage() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.activity_date || !form.location.trim()) {
      setStatus({ type: "error", message: "กรุณากรอกข้อมูลกิจกรรมให้ครบถ้วน" });
      return;
    }

    try {
      if (editingId) {
        await updateActivity(editingId, form);
        setStatus({ type: "success", message: "แก้ไขกิจกรรมเรียบร้อยแล้ว!" });
      } else {
        await createActivity(form);
        setStatus({ type: "success", message: "เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว!" });
      }
      resetForm();
      await loadActivities();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setForm({
      title: activity.title,
      description: activity.description || "",
      activity_date: activity.activity_date,
      location: activity.location,
      status: activity.status,
    });
    setStatus({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (activity) => {
    if (!window.confirm(`ต้องการลบกิจกรรม "${activity.title}" ใช่หรือไม่?`)) return;

    try {
      await deleteActivity(activity.id);
      if (editingId === activity.id) resetForm();
      if (viewing?.activity.id === activity.id) setViewing(null);
      setStatus({ type: "success", message: "ลบกิจกรรมเรียบร้อยแล้ว" });
      await loadActivities();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleViewParticipants = async (activity) => {
    setViewing({ activity, participants: [], loading: true, error: "" });
    try {
      const participants = await getParticipants(activity.id);
      setViewing({ activity, participants, loading: false, error: "" });
    } catch (err) {
      setViewing({ activity, participants: [], loading: false, error: err.message });
    }
  };

  if (loading) {
    return <StatusMessage type="loading" message="กำลังโหลดข้อมูล..." />;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>⚙️ หน้าจัดการระบบสำหรับผู้ดูแล (Admin)</h2>

      {status.message && <StatusMessage type={status.type} message={status.message} />}

      {/* ฟอร์มเพิ่ม/แก้ไขกิจกรรม */}
      <div style={{ background: "#fff", color: "#202124", textAlign: "left", padding: "20px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "30px" }}>
        <h3 style={{ color: "#202124", marginTop: 0 }}>
          {editingId ? "✏️ แก้ไขกิจกรรม" : "➕ เพิ่มกิจกรรมใหม่"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            type="text"
            placeholder="ชื่อกิจกรรม"
            value={form.title}
            onChange={handleChange("title")}
            style={fieldStyle}
          />
          <textarea
            placeholder="รายละเอียดกิจกรรม"
            value={form.description}
            onChange={handleChange("description")}
            rows="3"
            style={fieldStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <input
              type="date"
              value={form.activity_date}
              onChange={handleChange("activity_date")}
              style={fieldStyle}
            />
            <input
              type="text"
              placeholder="สถานที่"
              value={form.location}
              onChange={handleChange("location")}
              style={fieldStyle}
            />
            <select value={form.status} onChange={handleChange("status")} style={fieldStyle}>
              <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
              <option value="ปิดรับสมัคร">ปิดรับสมัคร</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button type="submit" style={{ background: "#34a853", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              {editingId ? "บันทึกการแก้ไข" : "บันทึกกิจกรรม"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ background: "#5f6368", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>
        </form>
      </div>

      {/* รายการกิจกรรมที่มีในระบบ */}
      <h3>📋 รายการกิจกรรมในระบบปัจจุบัน ({activities.length})</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #e0e0e0" }}>
          <thead>
            <tr style={{ background: "#f1f3f4", textAlign: "left" }}>
              <th style={cellStyle}>ชื่อกิจกรรม</th>
              <th style={cellStyle}>วันที่</th>
              <th style={cellStyle}>สถานที่</th>
              <th style={cellStyle}>สถานะ</th>
              <th style={cellStyle}>ผู้สมัคร</th>
              <th style={cellStyle}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr key={act.id} style={{ borderBottom: "1px solid #eee", textAlign: "left" }}>
                <td style={cellStyle}>{act.title}</td>
                <td style={cellStyle}>{act.activity_date}</td>
                <td style={cellStyle}>{act.location}</td>
                <td style={{ ...cellStyle, color: act.status === "เปิดรับสมัคร" ? "#137333" : "#5f6368", fontWeight: "bold" }}>
                  {act.status}
                </td>
                <td style={cellStyle}>{act.participant_count ?? 0} คน</td>
                <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                  <button onClick={() => handleViewParticipants(act)} style={{ background: "#9334e6", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "8px" }}>
                    ดูรายชื่อ
                  </button>
                  <button onClick={() => handleEdit(act)} style={{ background: "#4285f4", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "8px" }}>
                    แก้ไข
                  </button>
                  <button onClick={() => handleDelete(act)} style={{ background: "#ea4335", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...cellStyle, textAlign: "center" }}>ยังไม่มีกิจกรรมในระบบ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* รายชื่อผู้ลงทะเบียนของกิจกรรมที่เลือก */}
      {viewing && (
        <div style={{ background: "#fff", color: "#202124", textAlign: "left", padding: "20px", borderRadius: "12px", border: "1px solid #e0e0e0", marginTop: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h3 style={{ color: "#202124", margin: 0 }}>
              👥 ผู้ลงทะเบียน: {viewing.activity.title} ({viewing.participants.length} คน)
            </h3>
            <button onClick={() => setViewing(null)} style={{ background: "#5f6368", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              ปิด
            </button>
          </div>

          {viewing.loading && <StatusMessage type="loading" message="กำลังโหลดรายชื่อ..." />}
          {viewing.error && <StatusMessage type="error" message={viewing.error} />}

          {!viewing.loading && !viewing.error && (
            viewing.participants.length === 0 ? (
              <p style={{ color: "#5f6368" }}>ยังไม่มีผู้ลงทะเบียนในกิจกรรมนี้</p>
            ) : (
              <div style={{ overflowX: "auto", marginTop: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f1f3f4", textAlign: "left" }}>
                      <th style={cellStyle}>#</th>
                      <th style={cellStyle}>รหัสนักศึกษา</th>
                      <th style={cellStyle}>ชื่อ - สกุล</th>
                      <th style={cellStyle}>อีเมล</th>
                      <th style={cellStyle}>เวลาที่ลงทะเบียน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewing.participants.map((person, index) => (
                      <tr key={person.id} style={{ borderBottom: "1px solid #eee", textAlign: "left" }}>
                        <td style={cellStyle}>{index + 1}</td>
                        <td style={cellStyle}>{person.student_id}</td>
                        <td style={cellStyle}>{person.student_name}</td>
                        <td style={cellStyle}>{person.email}</td>
                        <td style={cellStyle}>{person.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default AdminManage;

// src/pages/AdminManage.jsx
import { useState, useEffect } from "react";
import { getActivities, createActivity } from "../services/api";
import StatusMessage from "../components/StatusMessage";

function AdminManage() {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [location, setLocation] = useState("");

  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const data = await getActivities();
    setActivities(data);
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !activityDate || !location) {
      setStatus({ type: "error", message: "กรุณากรอกข้อมูลกิจกรรมให้ครบถ้วน" });
      return;
    }

    await createActivity({ title, description, activity_date: activityDate, location });
    setStatus({ type: "success", message: "เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว!" });
    
    // ล้างค่าฟอร์ม
    setTitle("");
    setDescription("");
    setActivityDate("");
    setLocation("");
    loadActivities();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>⚙️ หน้าจัดการระบบสำหรับผู้ดูแล (Admin)</h2>

      {status.message && <StatusMessage type={status.type} message={status.message} />}

      {/* ฟอร์มเพิ่มกิจกรรม */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "30px" }}>
        <h3>➕ เพิ่มกิจกรรมใหม่</h3>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: "12px" }}>
          <input
            type="text"
            placeholder="ชื่อกิจกรรม"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <textarea
            placeholder="รายละเอียดกิจกรรม"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              placeholder="สถานที่"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>
          <button type="submit" style={{ background: "#34a853", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            บันทึกกิจกรรม
          </button>
        </form>
      </div>

      {/* รายการกิจกรรมที่มีในระบบ */}
      <h3>📋 รายการกิจกรรมในระบบปัจจุบัน ({activities.length})</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", border: "1px solid #e0e0e0" }}>
        <thead>
          <tr style={{ background: "#f1f3f4", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>ชื่อกิจกรรม</th>
            <th style={{ padding: "12px" }}>วันที่</th>
            <th style={{ padding: "12px" }}>สถานที่</th>
            <th style={{ padding: "12px" }}>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((act) => (
            <tr key={act.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{act.title}</td>
              <td style={{ padding: "12px" }}>{act.activity_date}</td>
              <td style={{ padding: "12px" }}>{act.location}</td>
              <td style={{ padding: "12px", color: "#137333", fontWeight: "bold" }}>{act.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminManage;
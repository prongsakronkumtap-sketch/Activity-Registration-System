// src/pages/RegisterForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getActivityById } from "../services/api";
import StatusMessage from "../components/StatusMessage";

function RegisterForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActivityById(id);
        setActivity(data);
      } catch {
        setStatus({ type: "error", message: "ไม่พบกิจกรรมที่ต้องการลงทะเบียน" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId.trim() || !studentName.trim() || !email.trim()) {
      setStatus({ type: "error", message: "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง" });
      return;
    }

    // บันทึกสำเร็จ
    setStatus({ type: "success", message: "ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จแล้ว!" });
    setTimeout(() => {
      navigate("/activities");
    }, 1500);
  };

  if (loading) return <StatusMessage type="loading" message="กำลังโหลดข้อมูล..." />;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
      <h2>ลงทะเบียน: {activity?.title}</h2>
      
      {status.message && <StatusMessage type={status.type} message={status.message} />}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>รหัสนักศึกษา *</label>
          <input
            type="text"
            placeholder="เช่น 660001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>ชื่อ - สกุล *</label>
          <input
            type="text"
            placeholder="เช่น นายสมชาย ใจดี"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>อีเมล *</label>
          <input
            type="email"
            placeholder="เช่น student@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button type="submit" style={{ background: "#4285f4", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            ยืนยันการลงทะเบียน
          </button>
          <Link to="/activities" style={{ background: "#5f6368", color: "#fff", padding: "12px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", textAlign: "center" }}>
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
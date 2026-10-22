// src/pages/RegisterForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getActivityById, registerParticipant } from "../services/api";
import StatusMessage from "../components/StatusMessage";

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  background: "#fff",
  color: "#202124",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "6px",
  color: "#202124",
};

function RegisterForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActivityById(id);
        setActivity(data);
      } catch (err) {
        setStatus({ type: "error", message: err.message });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId.trim() || !studentName.trim() || !email.trim()) {
      setStatus({ type: "error", message: "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง" });
      return;
    }

    setSubmitting(true);
    try {
      await registerParticipant(id, {
        student_id: studentId,
        student_name: studentName,
        email,
      });
      setStatus({ type: "success", message: "ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จแล้ว!" });
      setTimeout(() => {
        navigate("/activities");
      }, 1500);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      setSubmitting(false);
    }
  };

  if (loading) return <StatusMessage type="loading" message="กำลังโหลดข้อมูล..." />;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "24px",
        background: "#fff",
        color: "#202124",
        textAlign: "left",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
      }}
    >
      <h2 style={{ color: "#202124", marginTop: 0 }}>
        ลงทะเบียน: {activity?.title}
      </h2>

      {status.message && <StatusMessage type={status.type} message={status.message} />}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
        <div>
          <label style={labelStyle}>รหัสนักศึกษา *</label>
          <input
            type="text"
            placeholder="เช่น 660001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>ชื่อ - สกุล *</label>
          <input
            type="text"
            placeholder="เช่น นายสมชาย ใจดี"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>อีเมล *</label>
          <input
            type="email"
            placeholder="เช่น student@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ background: "#4285f4", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
          >
            ยืนยันการลงทะเบียน
          </button>
          <Link
            to="/activities"
            style={{ background: "#5f6368", color: "#fff", padding: "12px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", textAlign: "center" }}
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;

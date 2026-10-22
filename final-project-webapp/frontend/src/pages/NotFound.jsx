// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "500px", margin: "40px auto", background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
      <h1 style={{ fontSize: "72px", margin: "0", color: "#ea4335" }}>404</h1>
      <h2 style={{ color: "#202124", marginTop: "10px" }}>ไม่พบหน้าที่คุณต้องการ</h2>
      <p style={{ color: "#5f6368", marginBottom: "30px" }}>
        ขออภัย เส้นทางหน้าเว็บที่คุณกำลังเข้าถึงไม่มีอยู่ในระบบ หรืออาจถูกย้ายไปแล้ว
      </p>
      <Link to="/" style={{ background: "#4285f4", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
        กลับสู่หน้าหลัก (Dashboard)
      </Link>
    </div>
  );
}

export default NotFound;
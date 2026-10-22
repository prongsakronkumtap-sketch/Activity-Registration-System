import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar" style={{ background: "#202124", color: "#fff", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
      <div className="navbar-brand">
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "20px", fontWeight: "bold" }}>
          📅 ระบบลงทะเบียนกิจกรรม
        </Link>
      </div>
      <div className="navbar-links" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/activities" style={{ color: "#fff", textDecoration: "none" }}>รายการกิจกรรม</Link>
        <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>จัดการระบบ (Admin)</Link>
      </div>
    </nav>
  );
}

export default Navbar;
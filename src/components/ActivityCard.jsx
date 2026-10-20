// src/components/ActivityCard.jsx
import { Link } from "react-router-dom";

function ActivityCard({ activity }) {
  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: "0 0 8px", color: "#202124" }}>{activity.title}</h3>
        <span style={{ background: "#e6f4ea", color: "#137333", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
          {activity.status}
        </span>
      </div>
      <p style={{ color: "#5f6368", margin: "0 0 12px" }}>{activity.description}</p>
      <p style={{ fontSize: "14px", color: "#3c4043", margin: "0 0 16px" }}>
        📅 <strong>วันที่:</strong> {activity.activity_date} &nbsp;|&nbsp; 📍 <strong>สถานที่:</strong> {activity.location}
      </p>
      <div>
        <Link to={`/activities/${activity.id}`} style={{ background: "#34a853", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
          ดูรายละเอียด / ลงทะเบียน
        </Link>
      </div>
    </div>
  );
}

export default ActivityCard;
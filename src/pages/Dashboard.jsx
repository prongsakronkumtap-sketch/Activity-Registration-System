// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { getActivities } from "../services/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>กำลังโหลดข้อมูล Dashboard...</div>;
  }

  return (
    <div className="dashboard" style={{ padding: "20px" }}>
      <h2>ภาพรวมระบบ (Dashboard)</h2>
      
      {/* ส่วนแสดงสถิติสรุป */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", margin: "20px 0" }}>
        <div style={{ background: "#e8f0fe", padding: "20px", borderRadius: "10px", textAlign: "center", borderLeft: "5px solid #4285f4" }}>
          <h3 style={{ fontSize: "32px", margin: "0", color: "#4285f4" }}>{activities.length}</h3>
          <p style={{ margin: "5px 0 0", color: "#5f6368" }}>กิจกรรมทั้งหมด</p>
        </div>
        <div style={{ background: "#e6f4ea", padding: "20px", borderRadius: "10px", textAlign: "center", borderLeft: "5px solid #34a853" }}>
          <h3 style={{ fontSize: "32px", margin: "0", color: "#34a853" }}>
            {activities.filter(a => a.status === "เปิดรับสมัคร").length}
          </h3>
          <p style={{ margin: "5px 0 0", color: "#5f6368" }}>กำลังเปิดรับสมัคร</p>
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>กิจกรรมล่าสุด</h3>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "12px" }}>
        {activities.slice(0, 3).map(activity => (
          <li key={activity.id} style={{ background: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ margin: "0 0 6px" }}>{activity.title}</h4>
              <p style={{ margin: "0", fontSize: "14px", color: "#5f6368" }}>📅 วันที่: {activity.activity_date} | 📍 สถานที่: {activity.location}</p>
            </div>
            <Link to={`/activities/${activity.id}`} style={{ background: "#4285f4", color: "#fff", padding: "8px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
              ดูรายละเอียด
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
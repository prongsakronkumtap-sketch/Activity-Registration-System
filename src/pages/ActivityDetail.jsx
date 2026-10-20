// src/pages/ActivityDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getActivityById } from "../services/api";
import StatusMessage from "../components/StatusMessage";

function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActivityById(id);
        setActivity(data);
      } catch {
        setError("ไม่พบข้อมูลกิจกรรมที่คุณค้นหา");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <StatusMessage type="loading" message="กำลังโหลดข้อมูลกิจกรรม..." />;
  }

  if (error) {
    return <StatusMessage type="error" message={error} />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ color: "#202124", margin: 0 }}>{activity.title}</h2>
        <span style={{ background: "#e6f4ea", color: "#137333", padding: "6px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
          {activity.status}
        </span>
      </div>

      <p style={{ fontSize: "16px", color: "#3c4043", lineHeight: "1.6", marginTop: "10px" }}>
        {activity.description}
      </p>

      <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "10px", margin: "20px 0", display: "grid", gap: "8px" }}>
        <p style={{ margin: 0, color: "#202124" }}>📅 <strong>วันที่จัดกิจกรรม:</strong> {activity.activity_date}</p>
        <p style={{ margin: 0, color: "#202124" }}>📍 <strong>สถานที่:</strong> {activity.location}</p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <Link
          to={`/register/${activity.id}`}
          style={{ background: "#4285f4", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}
        >
          ลงทะเบียนเข้าร่วมกิจกรรม
        </Link>
        <Link
          to="/activities"
          style={{ background: "#5f6368", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}
        >
          ย้อนกลับ
        </Link>
      </div>
    </div>
  );
}

export default ActivityDetail;

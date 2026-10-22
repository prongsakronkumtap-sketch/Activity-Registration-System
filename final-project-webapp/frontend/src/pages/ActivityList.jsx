// src/pages/ActivityList.jsx
import { useState, useEffect } from "react";
import { getActivities } from "../services/api";
import ActivityCard from "../components/ActivityCard";
import StatusMessage from "../components/StatusMessage";

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const keyword = searchTerm.toLowerCase();
  const filteredActivities = activities.filter((activity) => {
    const matchSearch =
      activity.title.toLowerCase().includes(keyword) ||
      (activity.description || "").toLowerCase().includes(keyword);
    const matchStatus = statusFilter === "ทั้งหมด" || activity.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <StatusMessage type="loading" message="กำลังโหลดรายการกิจกรรม..." />;
  }

  if (error) {
    return <StatusMessage type="error" message={error} />;
  }

  return (
    <div className="activity-list-page" style={{ padding: "20px" }}>
      <h2>รายการกิจกรรมทั้งหมด</h2>

      <div style={{ margin: "20px 0", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อกิจกรรม หรือรายละเอียด..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: "1 1 260px", padding: "12px", borderRadius: "10px", border: "1px solid #dadce0", fontSize: "16px", outline: "none", boxSizing: "border-box", background: "#fff", color: "#202124" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #dadce0", fontSize: "16px", background: "#fff", color: "#202124" }}
        >
          <option value="ทั้งหมด">ทุกสถานะ</option>
          <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
          <option value="ปิดรับสมัคร">ปิดรับสมัคร</option>
        </select>
      </div>

      {filteredActivities.length === 0 ? (
        <StatusMessage type="info" message="ไม่พบข้อมูลกิจกรรมที่ตรงกับคำค้นหา" />
      ) : (
        <div>
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityList;

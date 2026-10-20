// src/pages/ActivityList.jsx
import { useState, useEffect } from "react";
import { getActivities } from "../services/api";
import ActivityCard from "../components/ActivityCard";
import StatusMessage from "../components/StatusMessage";

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <StatusMessage type="loading" message="กำลังโหลดรายการกิจกรรม..." />;
  }

  return (
    <div className="activity-list-page" style={{ padding: "20px" }}>
      <h2>รายการกิจกรรมทั้งหมด</h2>
      
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อกิจกรรม หรือรายละเอียด..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #dadce0", fontSize: "16px", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {filteredActivities.length === 0 ? (
        <StatusMessage type="info" message="ไม่พบข้อมูลกิจกรรมที่ตรงกับคำค้นหา" />
      ) : (
        <div>
          {filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityList;
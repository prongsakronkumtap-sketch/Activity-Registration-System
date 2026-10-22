// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่");
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // ไม่มี body เป็น JSON
  }

  if (!response.ok) {
    throw new Error(body?.message || "เกิดข้อผิดพลาดในการเรียกใช้งานระบบ");
  }
  return body;
}

export async function getActivities() {
  const result = await request("/activities");
  return result.data;
}

export async function getActivityById(id) {
  const result = await request(`/activities/${id}`);
  return result.data;
}

export async function createActivity(activityData) {
  return request("/activities", {
    method: "POST",
    body: JSON.stringify(activityData),
  });
}

export async function updateActivity(id, activityData) {
  return request(`/activities/${id}`, {
    method: "PUT",
    body: JSON.stringify(activityData),
  });
}

export async function deleteActivity(id) {
  return request(`/activities/${id}`, { method: "DELETE" });
}

export async function registerParticipant(activityId, participantData) {
  return request(`/activities/${activityId}/participants`, {
    method: "POST",
    body: JSON.stringify(participantData),
  });
}

export async function getParticipants(activityId) {
  const result = await request(`/activities/${activityId}/participants`);
  return result.data;
}

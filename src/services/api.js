let initialActivities = [
  {
    id: 1,
    title: "อบรม React เบื้องต้น",
    description: "เรียนรู้การพัฒนาเว็บแอปพลิเคชันด้วย React และ Vite",
    activity_date: "2026-05-10",
    location: "ห้อง Lab คอมพิวเตอร์ 301",
    status: "เปิดรับสมัคร"
  },
  {
    id: 2,
    title: "กิจกรรมจิตอาสาพัฒนา 2026",
    description: "ร่วมพัฒนาและปรับปรุงภูมิทัศน์ภายในมหาวิทยาลัย",
    activity_date: "2026-05-15",
    location: "ลานกิจกรรมกลางแจ้ง",
    status: "เปิดรับสมัคร"
  }
];


export async function getActivities() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialActivities);
    }, 300);
  });
}


export async function getActivityById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activity = initialActivities.find((item) => item.id === Number(id));
      if (activity) {
        resolve(activity);
      } else {
        reject(new Error("ไม่พบข้อมูลกิจกรรม"));
      }
    }, 300);
  });
}

// ฟังก์ชันเพิ่มกิจกรรมใหม่ (สำหรับผู้ดูแลระบบ)
export async function createActivity(activityData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newActivity = {
        id: Date.now(),
        ...activityData,
        status: "เปิดรับสมัคร"
      };
      initialActivities.push(newActivity);
      resolve({ message: "เพิ่มกิจกรรมสำเร็จ", data: newActivity });
    }, 300);
  });
}
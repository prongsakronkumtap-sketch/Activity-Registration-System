import "dotenv/config";
import express from "express";
import cors from "cors";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API ทำงานปกติ" });
});

app.use("/api/activities", activityRoutes);

// ไม่พบเส้นทาง -> ตอบเป็น JSON
app.use((req, res) => {
  res.status(404).json({ message: "ไม่พบเส้นทางที่ร้องขอ" });
});

// จัดการ error ทั้งหมดเป็น JSON
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "รูปแบบ JSON ไม่ถูกต้อง" });
  }
  console.error(err);
  res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

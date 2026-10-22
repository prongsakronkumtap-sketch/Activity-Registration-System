import "dotenv/config";
import mysql from "mysql2/promise";

// Connection pool ใช้ร่วมกันทั้งระบบ
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "activity_db",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  dateStrings: true, // ให้คอลัมน์ DATE ส่งออกเป็นข้อความ YYYY-MM-DD
});

export default pool;

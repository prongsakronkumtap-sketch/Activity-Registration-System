import express from "express";
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  registerParticipant,
  getParticipants,
} from "../controllers/activityController.js";

const router = express.Router();

// ส่ง error จาก async function ไปให้ error middleware จัดการ
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", wrap(getActivities));
router.get("/:id", wrap(getActivityById));
router.post("/", wrap(createActivity));
router.put("/:id", wrap(updateActivity));
router.delete("/:id", wrap(deleteActivity));
router.get("/:id/participants", wrap(getParticipants));
router.post("/:id/participants", wrap(registerParticipant));

export default router;

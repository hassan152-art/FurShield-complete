import { Router } from "express";
import { bookAppointment, myAppointments, updateAppointmentStatus, logTreatment } from "../controllers/appointmentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", myAppointments);
router.post("/", authorize("owner"), bookAppointment);
router.patch("/:id/status", authorize("owner", "veterinarian", "admin"), updateAppointmentStatus);
router.patch("/:id/log", authorize("veterinarian"), logTreatment);

export default router;

import { Router } from "express";
import {
  listHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} from "../controllers/healthRecordController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("owner", "veterinarian", "admin"));

router.get("/", listHealthRecords);
router.post("/", createHealthRecord);
router.put("/:id", updateHealthRecord);
router.delete("/:id", deleteHealthRecord);

export default router;

import { Router } from "express";
import {
  listInsurance,
  addInsurance,
  updateInsurance,
  deleteInsurance,
} from "../controllers/insuranceController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("owner"));

router.get("/", listInsurance);
router.post("/", addInsurance);
router.put("/:id", updateInsurance);
router.delete("/:id", deleteInsurance);

export default router;

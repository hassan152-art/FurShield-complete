import { Router } from "express";
import { askAssistant } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/ask", protect, askAssistant);

export default router;

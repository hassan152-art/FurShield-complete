import { Router } from "express";
import { sendMessage } from "../controllers/contactController.js";

const router = Router();
router.post("/", sendMessage);

export default router;

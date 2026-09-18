import { Router } from "express";
import { listBanners } from "../controllers/bannerController.js";

const router = Router();
router.get("/", listBanners);

export default router;

import { Router } from "express";
import { listArticles, getArticle, listVideos, listFaqs } from "../controllers/careController.js";

const router = Router();
router.get("/articles", listArticles);
router.get("/articles/:slug", getArticle);
router.get("/videos", listVideos);
router.get("/faqs", listFaqs);

export default router;

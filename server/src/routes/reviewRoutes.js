import { Router } from "express";
import { addReview, listReviews, updateReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", listReviews);
router.post("/", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;

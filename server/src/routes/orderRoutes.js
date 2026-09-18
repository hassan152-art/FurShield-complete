import { Router } from "express";
import { checkout, myOrders } from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("owner"));
router.post("/checkout", checkout);
router.get("/", myOrders);

export default router;

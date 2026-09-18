import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("owner"));
router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeFromCart);

export default router;

import { Router } from "express";
import {
  analytics, listUsers, setUserActive,
  listAllProducts, createProduct, updateProduct, deleteProduct,
  listAllOrders, updateOrderStatus,
  listAllReviews, moderateReview,
  listAllAppointments,
  listAllAdoptions, updateAdoptionStatus,
  listAllPets,
  listAllBanners, createBanner, updateBanner, deleteBanner,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("admin"));

router.get("/analytics", analytics);

router.get("/users", listUsers);
router.patch("/users/:id/status", setUserActive);

router.get("/pets", listAllPets);

router.get("/products", listAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", listAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/appointments", listAllAppointments);

router.get("/adoptions", listAllAdoptions);
router.patch("/adoptions/:id/status", updateAdoptionStatus);

router.get("/reviews", listAllReviews);
router.delete("/reviews/:id", moderateReview);

router.get("/banners", listAllBanners);
router.post("/banners", createBanner);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

export default router;

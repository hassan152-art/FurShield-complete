import { Router } from "express";
import { addCareLog, listCareLogs, myListings } from "../controllers/shelterController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("shelter"));
router.get("/listings", myListings);
router.post("/listings/:listingId/care-logs", addCareLog);
router.get("/listings/:listingId/care-logs", listCareLogs);

export default router;

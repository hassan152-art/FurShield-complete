import { Router } from "express";
import {
  listAdoptions, getAdoption, createListing, updateListing, deleteListing,
  submitInterest, listInterestsForShelter, updateInterestStatus,
} from "../controllers/adoptionController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.get("/", listAdoptions);
router.get("/interests", protect, authorize("shelter"), listInterestsForShelter);
router.get("/:id", getAdoption);
router.post("/", protect, authorize("shelter"), createListing);
router.put("/:id", protect, authorize("shelter"), updateListing);
router.delete("/:id", protect, authorize("shelter"), deleteListing);
router.post("/:id/interest", protect, authorize("owner"), submitInterest);
router.patch("/interests/:id", protect, authorize("shelter"), updateInterestStatus);

export default router;

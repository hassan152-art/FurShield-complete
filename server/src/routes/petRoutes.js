import { Router } from "express";
import { listMyPets, getPet, createPet, updatePet, deletePet } from "../controllers/petController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("owner"));
router.get("/", listMyPets);
router.post("/", createPet);
router.get("/:id", getPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;

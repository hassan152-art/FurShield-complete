import { Router } from "express";
import {
  listMedicalDocuments,
  addMedicalDocument,
  deleteMedicalDocument,
} from "../controllers/medicalDocumentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("owner"));

router.get("/", listMedicalDocuments);
router.post("/", addMedicalDocument);
router.delete("/:id", deleteMedicalDocument);

export default router;

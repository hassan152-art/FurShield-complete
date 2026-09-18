import { Router } from "express";
import { uploadImage, uploadVideo, uploadDocument } from "../controllers/uploadController.js";
import { uploadImageMiddleware, uploadVideoMiddleware, uploadDocumentMiddleware } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import { fail } from "../utils/ApiResponse.js";

const router = Router();

// Any authenticated user can upload media for their own records (pet photos,
// product photos if admin, adoption listing photos/videos if shelter). The
// controllers that consume these URLs still enforce their own role checks.
router.use(protect);

router.post("/image", (req, res, next) => {
  uploadImageMiddleware(req, res, (err) => {
    if (err) return fail(res, err.message || "Image upload failed", 400);
    next();
  });
}, uploadImage);

router.post("/video", (req, res, next) => {
  uploadVideoMiddleware(req, res, (err) => {
    if (err) return fail(res, err.message || "Video upload failed", 400);
    next();
  });
}, uploadVideo);

router.post("/document", (req, res, next) => {
  uploadDocumentMiddleware(req, res, (err) => {
    if (err) return fail(res, err.message || "Document upload failed", 400);
    next();
  });
}, uploadDocument);

export default router;

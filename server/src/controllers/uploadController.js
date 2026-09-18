import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const baseUrl = (req) => `${req.protocol}://${req.get("host")}`;

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, "No image file received", 400);
  const url = `${baseUrl(req)}/uploads/images/${req.file.filename}`;
  return ok(res, { url }, "Image uploaded successfully", 201);
});

export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, "No video file received", 400);
  const url = `${baseUrl(req)}/uploads/videos/${req.file.filename}`;
  return ok(res, { url }, "Video uploaded successfully", 201);
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, "No document file received", 400);
  const url = `${baseUrl(req)}/uploads/documents/${req.file.filename}`;
  return ok(res, { url, fileType: req.file.mimetype }, "Document uploaded successfully", 201);
});

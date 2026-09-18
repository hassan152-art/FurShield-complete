import { MedicalDocument } from "../models/MedicalDocument.js";
import { Pet } from "../models/Pet.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function assertOwnsPet(req, petId) {
  const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
  return pet;
}

export const listMedicalDocuments = asyncHandler(async (req, res) => {
  const { petId } = req.query;
  if (!petId) return fail(res, "petId is required", 422);
  const pet = await assertOwnsPet(req, petId);
  if (!pet) return fail(res, "Pet not found", 404);

  const documents = await MedicalDocument.find({ pet: petId }).sort({ createdAt: -1 });
  return ok(res, { documents }, "Medical documents fetched");
});

export const addMedicalDocument = asyncHandler(async (req, res) => {
  const { pet: petId, label, fileUrl, fileType } = req.body;
  if (!petId || !label || !fileUrl) return fail(res, "pet, label and fileUrl are required", 422);
  const pet = await assertOwnsPet(req, petId);
  if (!pet) return fail(res, "Pet not found", 404);

  const document = await MedicalDocument.create({
    pet: petId, label, fileUrl, fileType, uploadedBy: req.user._id,
  });
  return ok(res, { document }, "Document uploaded", 201);
});

export const deleteMedicalDocument = asyncHandler(async (req, res) => {
  const document = await MedicalDocument.findById(req.params.id);
  if (!document) return fail(res, "Document not found", 404);
  const pet = await assertOwnsPet(req, document.pet);
  if (!pet) return fail(res, "You do not have permission to delete this document", 403);

  await document.deleteOne();
  return ok(res, {}, "Document removed");
});

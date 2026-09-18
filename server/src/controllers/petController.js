import { Pet } from "../models/Pet.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMyPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { pets }, "Pets fetched");
});

export const getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
  if (!pet) return fail(res, "Pet not found", 404);
  return ok(res, { pet }, "Pet fetched");
});

export const createPet = asyncHandler(async (req, res) => {
  const pet = await Pet.create({ ...req.body, owner: req.user._id });
  return ok(res, { pet }, "Pet added successfully", 201);
});

export const updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!pet) return fail(res, "Pet not found", 404);
  return ok(res, { pet }, "Pet profile updated successfully");
});

export const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!pet) return fail(res, "Pet not found", 404);
  return ok(res, {}, "Pet removed successfully");
});

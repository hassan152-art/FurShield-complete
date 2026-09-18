import { Insurance } from "../models/Insurance.js";
import { Pet } from "../models/Pet.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function assertOwnsPet(req, petId) {
  const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
  return pet;
}

export const listInsurance = asyncHandler(async (req, res) => {
  const { petId } = req.query;
  if (!petId) return fail(res, "petId is required", 422);
  const pet = await assertOwnsPet(req, petId);
  if (!pet) return fail(res, "Pet not found", 404);

  const policies = await Insurance.find({ pet: petId }).sort({ createdAt: -1 });
  return ok(res, { policies }, "Insurance policies fetched");
});

export const addInsurance = asyncHandler(async (req, res) => {
  const { pet: petId, provider, policyNumber, startDate, endDate, coverageInfo, documents } = req.body;
  if (!petId || !provider || !policyNumber) return fail(res, "pet, provider and policyNumber are required", 422);
  const pet = await assertOwnsPet(req, petId);
  if (!pet) return fail(res, "Pet not found", 404);

  const policy = await Insurance.create({
    pet: petId, provider, policyNumber, startDate, endDate, coverageInfo, documents: documents || [],
  });
  return ok(res, { policy }, "Insurance policy added", 201);
});

export const updateInsurance = asyncHandler(async (req, res) => {
  const policy = await Insurance.findById(req.params.id);
  if (!policy) return fail(res, "Policy not found", 404);
  const pet = await assertOwnsPet(req, policy.pet);
  if (!pet) return fail(res, "You do not have permission to edit this policy", 403);

  Object.assign(policy, req.body);
  await policy.save();
  return ok(res, { policy }, "Insurance policy updated");
});

export const deleteInsurance = asyncHandler(async (req, res) => {
  const policy = await Insurance.findById(req.params.id);
  if (!policy) return fail(res, "Policy not found", 404);
  const pet = await assertOwnsPet(req, policy.pet);
  if (!pet) return fail(res, "You do not have permission to delete this policy", 403);

  await policy.deleteOne();
  return ok(res, {}, "Insurance policy removed");
});

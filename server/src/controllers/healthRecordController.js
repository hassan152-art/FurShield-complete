import { HealthRecord } from "../models/HealthRecord.js";
import { Pet } from "../models/Pet.js";
import { Appointment } from "../models/Appointment.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// A vet may only see/add records for a pet they have (or had) an appointment with.
async function vetCanAccessPet(vetId, petId) {
  const appt = await Appointment.findOne({ veterinarian: vetId, pet: petId });
  return Boolean(appt);
}

async function assertPetAccess(req, petId) {
  const pet = await Pet.findById(petId);
  if (!pet) return { pet: null, allowed: false };
  if (req.user.role === "owner") {
    return { pet, allowed: String(pet.owner) === String(req.user._id) };
  }
  if (req.user.role === "veterinarian") {
    return { pet, allowed: await vetCanAccessPet(req.user._id, petId) };
  }
  if (req.user.role === "admin") return { pet, allowed: true };
  return { pet, allowed: false };
}

export const listHealthRecords = asyncHandler(async (req, res) => {
  const { petId } = req.query;
  if (!petId) return fail(res, "petId is required", 422);

  const { pet, allowed } = await assertPetAccess(req, petId);
  if (!pet) return fail(res, "Pet not found", 404);
  if (!allowed) return fail(res, "You do not have access to this pet's health records", 403);

  const records = await HealthRecord.find({ pet: petId })
    .populate("veterinarian", "name specialization")
    .sort({ date: -1 });
  return ok(res, { records, pet }, "Health records fetched");
});

export const createHealthRecord = asyncHandler(async (req, res) => {
  const { pet: petId, type, title, diagnosis, medication, notes, date, followUpDate } = req.body;
  if (!petId || !type || !title) return fail(res, "pet, type and title are required", 422);

  const { pet, allowed } = await assertPetAccess(req, petId);
  if (!pet) return fail(res, "Pet not found", 404);
  if (!allowed) return fail(res, "You do not have access to this pet", 403);

  const record = await HealthRecord.create({
    pet: petId,
    type,
    title,
    diagnosis,
    medication,
    notes,
    date: date || Date.now(),
    followUpDate: followUpDate || undefined,
    veterinarian: req.user.role === "veterinarian" ? req.user._id : req.body.veterinarian || undefined,
  });
  return ok(res, { record }, "Health record added", 201);
});

export const updateHealthRecord = asyncHandler(async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);
  if (!record) return fail(res, "Health record not found", 404);

  const { allowed } = await assertPetAccess(req, record.pet);
  const isCreatorVet = record.veterinarian && String(record.veterinarian) === String(req.user._id);
  if (!allowed && !isCreatorVet) return fail(res, "You do not have access to this record", 403);

  Object.assign(record, req.body);
  await record.save();
  return ok(res, { record }, "Health record updated");
});

export const deleteHealthRecord = asyncHandler(async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);
  if (!record) return fail(res, "Health record not found", 404);

  const { pet } = await assertPetAccess(req, record.pet);
  const isOwner = pet && req.user.role === "owner" && String(pet.owner) === String(req.user._id);
  const isCreatorVet = record.veterinarian && String(record.veterinarian) === String(req.user._id);
  if (!isOwner && !isCreatorVet && req.user.role !== "admin") {
    return fail(res, "You do not have permission to delete this record", 403);
  }

  await record.deleteOne();
  return ok(res, {}, "Health record deleted");
});

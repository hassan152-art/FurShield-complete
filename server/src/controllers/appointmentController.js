import { Appointment } from "../models/Appointment.js";
import { HealthRecord } from "../models/HealthRecord.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookAppointment = asyncHandler(async (req, res) => {
  const { petId, veterinarianId, date, time, reason } = req.body;
  if (!petId || !veterinarianId || !date || !time) {
    return fail(res, "Pet, veterinarian, date and time are required", 422);
  }

  const clash = await Appointment.findOne({
    veterinarian: veterinarianId, date, time,
    status: { $in: ["pending", "confirmed", "rescheduled"] },
  });
  if (clash) return fail(res, "This time slot is already booked. Please choose another.", 409);

  const appointment = await Appointment.create({
    owner: req.user._id, pet: petId, veterinarian: veterinarianId, date, time, reason,
  });
  return ok(res, { appointment }, "Appointment requested successfully", 201);
});

export const myAppointments = asyncHandler(async (req, res) => {
  const filter = req.user.role === "veterinarian"
    ? { veterinarian: req.user._id }
    : { owner: req.user._id };
  const appointments = await Appointment.find(filter)
    .populate("pet", "name species")
    .populate("veterinarian", "name specialization")
    .populate("owner", "name")
    .sort({ date: -1 });
  return ok(res, { appointments }, "Appointments fetched");
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, date, time } = req.body;
  const allowed = ["confirmed", "rescheduled", "completed", "cancelled"];
  if (status && !allowed.includes(status)) return fail(res, "Invalid status", 422);

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return fail(res, "Appointment not found", 404);

  const isOwner = String(appointment.owner) === String(req.user._id);
  const isVet = String(appointment.veterinarian) === String(req.user._id);
  if (!isOwner && !isVet && req.user.role !== "admin") return fail(res, "Not authorized for this appointment", 403);

  if (status) appointment.status = status;
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  await appointment.save();

  return ok(res, { appointment }, "Appointment updated successfully");
});

// Structured treatment logging by the assigned veterinarian: symptoms, diagnosis,
// prescribed medication and follow-up notes. Writes both to the appointment
// (so the vet sees it inline) and to a HealthRecord (so the owner sees it on
// the pet's health timeline).
export const logTreatment = asyncHandler(async (req, res) => {
  const { symptoms, diagnosis, medication, followUpNotes, followUpDate } = req.body;
  if (!diagnosis) return fail(res, "Diagnosis is required", 422);

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return fail(res, "Appointment not found", 404);
  if (String(appointment.veterinarian) !== String(req.user._id)) {
    return fail(res, "Only the assigned veterinarian can log this appointment", 403);
  }

  const summary = [
    symptoms && `Symptoms: ${symptoms}`,
    `Diagnosis: ${diagnosis}`,
    medication && `Medication: ${medication}`,
    followUpNotes && `Follow-up: ${followUpNotes}`,
  ].filter(Boolean).join("\n");

  appointment.notes = summary;
  if (appointment.status === "confirmed") appointment.status = "completed";
  await appointment.save();

  const record = await HealthRecord.create({
    pet: appointment.pet,
    veterinarian: req.user._id,
    type: "treatment",
    title: `Treatment logged by Dr. ${req.user.name}`,
    diagnosis,
    medication,
    notes: [symptoms && `Symptoms: ${symptoms}`, followUpNotes].filter(Boolean).join("\n"),
    date: Date.now(),
    followUpDate: followUpDate || undefined,
  });

  return ok(res, { appointment, record }, "Treatment logged successfully", 201);
});

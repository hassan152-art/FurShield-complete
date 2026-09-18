import { Appointment } from "../models/Appointment.js";
import { Notification } from "../models/Notification.js";

const REMINDER_MINUTES = 30;
// The job runs every CHECK_INTERVAL_MS, so this window just needs to be wider
// than that interval to guarantee every appointment is caught exactly once.
const WINDOW_MINUTES = 3;

function getAppointmentDateTime(appointment) {
  const d = new Date(appointment.date);
  const [hours, minutes] = (appointment.time || "00:00").split(":").map(Number);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  return d;
}

// Finds confirmed appointments starting in ~30 minutes that haven't been
// reminded yet, and creates a Notification for the pet owner for each one.
export async function sendAppointmentReminders() {
  const now = new Date();
  const windowStart = new Date(now.getTime() + (REMINDER_MINUTES - WINDOW_MINUTES / 2) * 60 * 1000);
  const windowEnd = new Date(now.getTime() + (REMINDER_MINUTES + WINDOW_MINUTES / 2) * 60 * 1000);

  // Narrow the query to appointments dated today or tomorrow before doing the
  // precise time-of-day comparison in JS (date + time are stored separately).
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setDate(dayEnd.getDate() + 1);
  dayEnd.setHours(23, 59, 59, 999);

  const candidates = await Appointment.find({
    status: "confirmed",
    reminderSent: { $ne: true },
    date: { $gte: dayStart, $lte: dayEnd },
  })
    .populate("pet", "name")
    .populate("veterinarian", "name");

  let sent = 0;
  for (const appointment of candidates) {
    const apptDateTime = getAppointmentDateTime(appointment);
    if (apptDateTime >= windowStart && apptDateTime <= windowEnd) {
      await Notification.create({
        user: appointment.owner,
        type: "appointment_reminder",
        message: `Reminder: ${appointment.pet?.name || "Your pet"}'s appointment with Dr. ${appointment.veterinarian?.name || "your vet"} is in about 30 minutes (${appointment.time}).`,
        link: "/dashboard/appointments",
      });
      appointment.reminderSent = true;
      await appointment.save();
      sent += 1;
    }
  }
  return sent;
}

// Starts the background poller. Runs once immediately, then on a fixed interval.
export function startAppointmentReminderScheduler() {
  const CHECK_INTERVAL_MS = 60 * 1000; // every minute

  const run = () => {
    sendAppointmentReminders()
      .then((sent) => {
        if (sent > 0) console.log(`Sent ${sent} appointment reminder notification(s).`);
      })
      .catch((err) => console.error("Appointment reminder check failed:", err.message));
  };

  run();
  setInterval(run, CHECK_INTERVAL_MS);
}

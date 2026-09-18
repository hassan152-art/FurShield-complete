import { ContactMessage } from "../models/ContactMessage.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return fail(res, "Name, email and message are required", 422);
  const contactMessage = await ContactMessage.create({ name, email, subject, message });
  return ok(res, { contactMessage }, "Your message has been sent. We will get back to you soon.", 201);
});

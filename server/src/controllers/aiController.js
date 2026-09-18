import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// AI calls happen server-side only; the key never reaches the client.
export const askAssistant = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) return fail(res, "A question is required", 422);
  if (!process.env.AI_API_KEY) {
    return fail(res, "The AI assistant is not configured on this server yet. Add AI_API_KEY to server/.env.", 503);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.AI_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "claude-sonnet-4-6",
        max_tokens: 500,
        system:
          "You are the FurShield pet-care assistant. Give clear, general pet-care guidance. " +
          "Always state you do not replace professional veterinary diagnosis, and tell users to " +
          "contact a veterinarian immediately for emergencies.",
        messages: [{ role: "user", content: question }],
      }),
    });
    const data = await response.json();
    const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
    return ok(res, { answer: text }, "Assistant response");
  } catch (err) {
    return fail(res, "The AI assistant is temporarily unavailable", 502);
  }
});

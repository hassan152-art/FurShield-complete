import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) return fail(res, "Not authorized, no token", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return fail(res, "User no longer exists", 401);
    req.user = user; // role always comes from DB, never trust client input
    next();
  } catch (err) {
    return fail(res, "Not authorized, invalid token", 401);
  }
});

// Usage: authorize("admin", "veterinarian")
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return fail(res, "You do not have permission to perform this action", 403);
  }
  next();
};

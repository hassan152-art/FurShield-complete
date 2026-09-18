import { Banner } from "../models/Banner.js";
import { ok } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listBanners = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = { isActive: true };
  if (type) filter.type = type;
  const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
  return ok(res, { banners }, "Banners fetched");
});

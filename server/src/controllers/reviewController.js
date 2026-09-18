import { Review } from "../models/Review.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addReview = asyncHandler(async (req, res) => {
  const { targetType, targetId, rating, comment } = req.body;
  if (!targetType || !targetId || !rating) return fail(res, "targetType, targetId and rating are required", 422);

  const existing = await Review.findOne({ author: req.user._id, targetType, targetId });
  if (existing) return fail(res, "You have already reviewed this item. You can edit your existing review.", 409);

  const review = await Review.create({ author: req.user._id, targetType, targetId, rating, comment });
  return ok(res, { review }, "Review submitted", 201);
});

export const listReviews = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;
  const reviews = await Review.find({ targetType, targetId }).populate("author", "name");
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return ok(res, { reviews, average, count: reviews.length }, "Reviews fetched");
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, author: req.user._id }, req.body, { new: true }
  );
  if (!review) return fail(res, "Review not found", 404);
  return ok(res, { review }, "Review updated");
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  if (!review) return fail(res, "Review not found", 404);
  return ok(res, {}, "Review deleted");
});

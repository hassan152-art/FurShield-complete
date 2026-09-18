import { CareArticle } from "../models/CareArticle.js";
import { CareVideo } from "../models/CareVideo.js";
import { FAQ } from "../models/FAQ.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listArticles = asyncHandler(async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) filter.title = new RegExp(q, "i");
  const articles = await CareArticle.find(filter).sort({ createdAt: -1 });
  return ok(res, { articles }, "Care articles fetched");
});

export const getArticle = asyncHandler(async (req, res) => {
  const article = await CareArticle.findOne({ slug: req.params.slug });
  if (!article) return fail(res, "Article not found", 404);
  return ok(res, { article }, "Article fetched");
});

export const listVideos = asyncHandler(async (req, res) => {
  const videos = await CareVideo.find().sort({ createdAt: -1 });
  return ok(res, { videos }, "Care videos fetched");
});

export const listFaqs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find().sort({ createdAt: -1 });
  return ok(res, { faqs }, "FAQs fetched");
});

import { User } from "../models/User.js";
import { Pet } from "../models/Pet.js";
import { Appointment } from "../models/Appointment.js";
import { AdoptionListing } from "../models/AdoptionListing.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Review } from "../models/Review.js";
import { Banner } from "../models/Banner.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalPets, vets, shelters, appointments, adoptions, products, orders] = await Promise.all([
    User.countDocuments(),
    Pet.countDocuments(),
    User.countDocuments({ role: "veterinarian" }),
    User.countDocuments({ role: "shelter" }),
    Appointment.countDocuments(),
    AdoptionListing.countDocuments({ status: "adopted" }),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);
  return ok(res, { totalUsers, totalPets, vets, shelters, appointments, adoptions, products, orders }, "Analytics fetched");
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select("-password");
  return ok(res, { users }, "Users fetched");
});

export const setUserActive = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select("-password");
  if (!user) return fail(res, "User not found", 404);
  return ok(res, { user }, isActive ? "Account activated" : "Account suspended");
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  return ok(res, { product }, "Product created", 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, { product }, "Product updated");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, {}, "Product deleted");
});

export const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("owner", "name email").sort({ createdAt: -1 });
  return ok(res, { orders }, "Orders fetched");
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return fail(res, "Order not found", 404);
  return ok(res, { order }, "Order status updated");
});

export const moderateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return fail(res, "Review not found", 404);
  return ok(res, {}, "Review removed by moderation");
});

export const listAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate("author", "name email").sort({ createdAt: -1 });
  return ok(res, { reviews }, "Reviews fetched");
});

export const listAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return ok(res, { products }, "Products fetched");
});

export const listAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("owner", "name email")
    .populate("pet", "name species")
    .populate("veterinarian", "name specialization")
    .sort({ date: -1 });
  return ok(res, { appointments }, "Appointments fetched");
});

export const listAllAdoptions = asyncHandler(async (req, res) => {
  const listings = await AdoptionListing.find().populate("shelter", "shelterName email").sort({ createdAt: -1 });
  return ok(res, { listings }, "Adoption listings fetched");
});

export const updateAdoptionStatus = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!listing) return fail(res, "Listing not found", 404);
  return ok(res, { listing }, "Adoption listing updated");
});

export const listAllPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find().populate("owner", "name email").sort({ createdAt: -1 });
  return ok(res, { pets }, "Pets fetched");
});

export const listAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ type: 1, order: 1, createdAt: -1 });
  return ok(res, { banners }, "Banners fetched");
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  return ok(res, { banner }, "Banner created", 201);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!banner) return fail(res, "Banner not found", 404);
  return ok(res, { banner }, "Banner updated");
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) return fail(res, "Banner not found", 404);
  return ok(res, {}, "Banner deleted");
});

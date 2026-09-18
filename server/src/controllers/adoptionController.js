import { AdoptionListing } from "../models/AdoptionListing.js";
import { AdoptionInterest } from "../models/AdoptionInterest.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAdoptions = asyncHandler(async (req, res) => {
  const { species, breed, gender, location, healthStatus, page = 1, limit = 12 } = req.query;
  const filter = { status: "available" };
  if (species) filter.species = species;
  if (breed) filter.breed = new RegExp(breed, "i");
  if (gender) filter.gender = gender;
  if (location) filter.location = new RegExp(location, "i");
  if (healthStatus) filter.healthStatus = healthStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const [listings, total] = await Promise.all([
    AdoptionListing.find(filter).populate("shelter", "shelterName").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    AdoptionListing.countDocuments(filter),
  ]);
  return ok(res, { listings, total, page: Number(page), pages: Math.ceil(total / limit) }, "Adoption listings fetched");
});

export const getAdoption = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findById(req.params.id).populate("shelter", "shelterName contactNumber address");
  if (!listing) return fail(res, "Listing not found", 404);
  return ok(res, { listing }, "Listing fetched");
});

export const createListing = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.create({ ...req.body, shelter: req.user._id });
  return ok(res, { listing }, "Adoption listing created", 201);
});

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findOneAndUpdate(
    { _id: req.params.id, shelter: req.user._id }, req.body, { new: true, runValidators: true }
  );
  if (!listing) return fail(res, "Listing not found", 404);
  return ok(res, { listing }, "Listing updated");
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findOneAndDelete({ _id: req.params.id, shelter: req.user._id });
  if (!listing) return fail(res, "Listing not found", 404);
  return ok(res, {}, "Listing removed");
});

export const submitInterest = asyncHandler(async (req, res) => {
  const interest = await AdoptionInterest.create({ ...req.body, listing: req.params.id, applicant: req.user._id });
  return ok(res, { interest }, "Adoption interest submitted successfully", 201);
});

export const listInterestsForShelter = asyncHandler(async (req, res) => {
  const listings = await AdoptionListing.find({ shelter: req.user._id }).select("_id");
  const listingIds = listings.map((l) => l._id);
  const interests = await AdoptionInterest.find({ listing: { $in: listingIds } })
    .populate("listing", "name").populate("applicant", "name email contactNumber");
  return ok(res, { interests }, "Adoption interests fetched");
});

export const updateInterestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const interest = await AdoptionInterest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!interest) return fail(res, "Interest not found", 404);
  return ok(res, { interest }, "Adoption interest updated");
});

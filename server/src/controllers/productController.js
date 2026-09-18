import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, sort = "-createdAt", page = 1, limit = 12 } = req.query;
  const filter = {};
  if (q) filter.name = new RegExp(q, "i");
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  return ok(res, { products, total, page: Number(page), pages: Math.ceil(total / limit) }, "Products fetched");
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, { product }, "Product fetched");
});

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ owner: req.user._id }).populate("items.product");
  if (!cart) cart = await Cart.create({ owner: req.user._id, items: [] });
  return ok(res, { cart }, "Cart fetched");
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return fail(res, "Product not found", 404);

  let cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) cart = new Cart({ owner: req.user._id, items: [] });

  const existing = cart.items.find((i) => String(i.product) === String(productId));
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ product: productId, quantity });

  await cart.save();
  await cart.populate("items.product");
  return ok(res, { cart }, "Added to cart");
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) return fail(res, "Cart not found", 404);
  const item = cart.items.find((i) => String(i.product) === String(req.params.productId));
  if (!item) return fail(res, "Item not in cart", 404);
  if (quantity <= 0) cart.items = cart.items.filter((i) => String(i.product) !== String(req.params.productId));
  else item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");
  return ok(res, { cart }, "Cart updated");
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) return fail(res, "Cart not found", 404);
  cart.items = cart.items.filter((i) => String(i.product) !== String(req.params.productId));
  await cart.save();
  await cart.populate("items.product");
  return ok(res, { cart }, "Item removed from cart");
});

export const checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return fail(res, "Your cart is empty", 400);

  const items = cart.items.map((i) => ({
    product: i.product._id, name: i.product.name, price: i.product.price, quantity: i.quantity,
  }));
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({ owner: req.user._id, items, total });
  cart.items = [];
  await cart.save();

  return ok(res, { order }, "Order request submitted. Payment and delivery are handled outside this application.", 201);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { orders }, "Orders fetched");
});

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart, Star, ArrowLeft, Trash2 } from "lucide-react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    api.get("/reviews", { params: { targetType: "product", targetId: id } })
      .then(({ data }) => { setReviews(data.data.reviews); setAverage(data.data.average); })
      .catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.data.product)).finally(() => setLoading(false));
    loadReviews();
  }, [id]);

  const addToCart = async () => {
    if (!user || user.role !== "owner") {
      toast.error("Log in as a pet owner to add items to your cart.");
      return;
    }
    try {
      await api.post("/cart/items", { productId: id, quantity: 1 });
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Log in to leave a review.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/reviews", { targetType: "product", targetId: id, rating, comment });
      toast.success("Review submitted. Thank you!");
      setComment("");
      setRating(5);
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMyReview = async (reviewId) => {
    if (!confirm("Remove your review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review removed");
      loadReviews();
    } catch {
      toast.error("Unable to remove review");
    }
  };

  if (loading) return <Spinner label="Loading product..." />;
  if (!product) return <div className="max-w-3xl mx-auto px-6 py-16">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/products" className="inline-flex items-center gap-1 text-emerald text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-mint/40 rounded-2xl overflow-hidden flex items-center justify-center text-forest/40">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            "No image"
          )}
        </div>
        <div>
          <p className="text-xs uppercase text-muted">{product.category.replace("_", " ")}</p>
          <h1 className="text-3xl font-extrabold text-forest mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 text-golden">
              <Star size={16} fill="currentColor" /> {average ? average.toFixed(1) : "New"}
            </div>
            <span className="text-muted text-sm">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
          <p className="text-muted mt-4">{product.description || "No description provided yet."}</p>
          <p className="text-3xl font-extrabold text-forest mt-6">Rs {product.price.toLocaleString()}</p>
          <p className="text-sm text-muted mt-1">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
          <Button className="mt-6" onClick={addToCart} disabled={product.stock === 0}>
            <ShoppingCart size={18} /> Add to Cart
          </Button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold text-forest mb-6">Customer Reviews</h2>

        {user ? (
          <form onSubmit={submitReview} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <p className="font-medium text-forest mb-2">Leave a review</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star size={22} className={n <= rating ? "text-golden" : "text-sand"} fill={n <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full border border-sand rounded-xl px-4 py-3"
              rows={3}
            />
            <Button type="submit" disabled={submitting} className="mt-3">
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        ) : (
          <Card className="mb-8">
            <p className="text-muted text-sm">
              <Link to="/login" className="text-emerald font-medium">Log in</Link> to leave a review for this product.
            </p>
          </Card>
        )}

        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first to review this product." />
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <Card key={r._id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-forest">{r.author?.name || "Anonymous"}</p>
                    <div className="flex text-golden">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} fill={n <= r.rating ? "currentColor" : "none"} className={n <= r.rating ? "" : "text-sand"} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-muted mt-2">{r.comment}</p>}
                  <p className="text-xs text-muted mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                {user && r.author?._id === user._id && (
                  <button onClick={() => deleteMyReview(r._id)} className="text-coral shrink-0" aria-label="Delete review">
                    <Trash2 size={16} />
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

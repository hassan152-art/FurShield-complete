import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import toast from "react-hot-toast";

const categories = ["", "food", "grooming", "toys", "accessories", "health_supplies", "training_aids"];

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/products", { params: { category: category || undefined, q: q || undefined } })
      .then(({ data }) => setProducts(data.data.products))
      .catch(() => toast.error("Unable to load products"))
      .finally(() => setLoading(false));
  }, [category, q]);

  const addToCart = async (productId) => {
    if (!user || user.role !== "owner") {
      toast.error("Log in as a pet owner to add items to your cart.");
      return;
    }
    try {
      await api.post("/cart/items", { productId, quantity: 1 });
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-forest">Pet Products</h1>
      <p className="text-muted mt-2">Food, grooming, toys and health essentials for your pet.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="border border-sand rounded-xl px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-emerald"
        />
        <select
          value={category} onChange={(e) => setSearchParams(e.target.value ? { category: e.target.value } : {})}
          className="border border-sand rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c ? c.replace("_", " ") : "All categories"}</option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState title="No products found" description="Try a different search or category." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Card key={p._id}>
                <Link to={`/products/${p._id}`}>
                  <div className="aspect-square bg-mint/40 rounded-xl mb-4 overflow-hidden flex items-center justify-center text-forest/40 text-sm">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <p className="text-xs uppercase text-muted">{p.category.replace("_", " ")}</p>
                  <h3 className="font-semibold text-forest mt-1 hover:text-emerald transition-colors">{p.name}</h3>
                </Link>
                <div className="flex items-center gap-1 text-golden text-sm mt-1">
                  <Star size={14} fill="currentColor" /> {p.ratingAverage?.toFixed(1) || "New"}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-bold text-forest">Rs {p.price.toLocaleString()}</p>
                  <Button variant="ghost" onClick={() => addToCart(p._id)} className="!px-3 !py-2">
                    <ShoppingCart size={18} />
                  </Button>
                </div>
                {p.stock === 0 && <p className="text-coral text-xs mt-2">Out of stock</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

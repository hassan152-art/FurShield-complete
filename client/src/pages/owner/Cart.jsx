import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.get("/cart").then(({ data }) => setCart(data.data.cart)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateQty = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/items/${productId}`, { quantity });
      setCart(data.data.cart);
    } catch {
      toast.error("Unable to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`);
      setCart(data.data.cart);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Unable to remove item");
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      await api.post("/orders/checkout");
      toast.success("Order request submitted! Payment and delivery happen outside the app.");
      navigate("/dashboard/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit order");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <Spinner label="Loading your cart..." />;

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-forest">My Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse the shop to add food, grooming and health products."
          action={<Link to="/products"><Button>Browse Products</Button></Link>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product._id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-mint/40 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag size={20} className="text-forest/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forest truncate">{item.product.name}</p>
                  <p className="text-sm text-muted">Rs {item.product.price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.product._id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-sand flex items-center justify-center text-forest hover:bg-sand" aria-label="Decrease quantity">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product._id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-sand flex items-center justify-center text-forest hover:bg-sand" aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.product._id)} className="text-coral ml-2" aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>

          <Card className="space-y-4">
            <h2 className="font-semibold text-forest text-lg">Order Summary</h2>
            <div className="flex justify-between text-sm text-muted">
              <span>Items</span><span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-forest text-lg border-t border-sand pt-3">
              <span>Total</span><span>Rs {total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted">
              This submits an order request only — payment and physical delivery are handled outside the application.
            </p>
            <Button onClick={checkout} disabled={checkingOut} className="w-full justify-center">
              {checkingOut ? "Submitting..." : "Submit Order Request"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

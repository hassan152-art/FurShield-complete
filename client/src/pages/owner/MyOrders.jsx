import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const toneFor = (s) => ({ requested: "golden", confirmed: "mint", processing: "mint", completed: "mint", cancelled: "coral" }[s] || "mint");

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders").then(({ data }) => setOrders(data.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading your orders..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-forest">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your order requests will show up here once you check out."
          action={<Link to="/products"><Button>Browse Products</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o._id}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint/40 flex items-center justify-center shrink-0">
                    <Package size={18} className="text-forest" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest">Order #{o._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge tone={toneFor(o.status)}>{o.status}</Badge>
              </div>
              <div className="mt-4 divide-y divide-sand/60">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-2 text-sm">
                    <span className="text-ink">{it.name} × {it.quantity}</span>
                    <span className="text-muted">Rs {(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-sand font-semibold text-forest">
                <span>Total</span><span>Rs {o.total.toLocaleString()}</span>
              </div>
              {o.note && <p className="text-xs text-muted mt-2">{o.note}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

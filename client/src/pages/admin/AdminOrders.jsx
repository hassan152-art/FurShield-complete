import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Badge from "../../components/ui/Badge.jsx";

const statuses = ["requested", "confirmed", "processing", "completed", "cancelled"];
const toneFor = (s) => ({ requested: "golden", confirmed: "mint", processing: "mint", completed: "mint", cancelled: "coral" }[s] || "mint");

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/orders").then(({ data }) => setOrders(data.data.orders)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success("Order status updated");
      load();
    } catch {
      toast.error("Unable to update order");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest mb-6">Orders</h1>
      {loading ? <Spinner label="Loading orders..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-sand/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-forest">{o.owner?.name}</td>
                  <td className="px-4 py-3 text-muted">{o.items.length} item(s)</td>
                  <td className="px-4 py-3">Rs {o.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge tone={toneFor(o.status)}>{o.status}</Badge></td>
                  <td className="px-4 py-3 text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border border-sand rounded-lg px-2 py-1 text-xs"
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BellRing, CheckCheck } from "lucide-react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/notifications").then(({ data }) => setNotifications(data.data.notifications)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      load();
    } catch {
      toast.error("Unable to update notification");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      toast.success("All notifications marked as read");
      load();
    } catch {
      toast.error("Unable to update notifications");
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <EmptyState title="Log in to see your notifications" description="Notifications are tied to your FurShield account." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-forest">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" onClick={markAllRead} className="!px-4 !py-2 text-sm">
            <CheckCheck size={16} /> Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <Spinner label="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="Reminders about appointments, vaccinations and more will show up here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n._id} className={`flex items-start gap-4 ${!n.isRead ? "border-l-4 border-emerald" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center shrink-0">
                <BellRing size={18} className="text-forest" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink">{n.message}</p>
                <p className="text-xs text-muted mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n._id)} className="text-xs text-emerald font-medium shrink-0">
                  Mark read
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

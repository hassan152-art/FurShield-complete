import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";

const roles = ["", "owner", "veterinarian", "shelter", "admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role") || "";
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/users", { params: { role: role || undefined } })
      .then(({ data }) => setUsers(data.data.users))
      .catch(() => toast.error("Unable to load users"))
      .finally(() => setLoading(false));
  };
  useEffect(load, [role]);

  const toggleActive = async (u) => {
    try {
      await api.patch(`/admin/users/${u._id}/status`, { isActive: !u.isActive });
      toast.success(u.isActive ? "Account suspended" : "Account activated");
      load();
    } catch {
      toast.error("Unable to update account status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-forest">Users</h1>
        <select
          value={role}
          onChange={(e) => setSearchParams(e.target.value ? { role: e.target.value } : {})}
          className="border border-sand rounded-xl px-4 py-2"
        >
          {roles.map((r) => <option key={r} value={r}>{r || "All roles"}</option>)}
        </select>
      </div>

      {loading ? <Spinner label="Loading users..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-sand/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-forest">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.isActive ? "mint" : "coral"}>{u.isActive ? "Active" : "Suspended"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => toggleActive(u)}>
                        {u.isActive ? "Suspend" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

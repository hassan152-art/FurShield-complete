import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import PageLoader from "./components/common/PageLoader.jsx";
import AiChatWidget from "./components/common/AiChatWidget.jsx";

import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Home from "./pages/public/Home.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import Vets from "./pages/public/Vets.jsx";
import Adoption from "./pages/public/Adoption.jsx";
import AdoptionDetail from "./pages/public/AdoptionDetail.jsx";
import Products from "./pages/public/Products.jsx";
import ProductDetail from "./pages/public/ProductDetail.jsx";
import CareGuide from "./pages/public/CareGuide.jsx";
import CareArticleDetail from "./pages/public/CareArticleDetail.jsx";
import About from "./pages/public/About.jsx";
import Contact from "./pages/public/Contact.jsx";
import Notifications from "./pages/public/Notifications.jsx";

import DashboardHome from "./pages/owner/DashboardHome.jsx";
import MyPets from "./pages/owner/MyPets.jsx";
import MyAppointments from "./pages/owner/MyAppointments.jsx";
import BookAppointment from "./pages/owner/BookAppointment.jsx";
import PetHealth from "./pages/owner/PetHealth.jsx";
import Cart from "./pages/owner/Cart.jsx";
import MyOrders from "./pages/owner/MyOrders.jsx";

import VetDashboard from "./pages/veterinarian/VetDashboard.jsx";
import ShelterDashboard from "./pages/shelter/ShelterDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminPets from "./pages/admin/AdminPets.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminAppointments from "./pages/admin/AdminAppointments.jsx";
import AdminAdoptions from "./pages/admin/AdminAdoptions.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";
import AdminBanners from "./pages/admin/AdminBanners.jsx";

const ownerLinks = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/pets", label: "My Pets" },
  { to: "/dashboard/appointments", label: "Appointments" },
  { to: "/dashboard/cart", label: "Cart" },
  { to: "/dashboard/orders", label: "Orders" },
];
const vetLinks = [{ to: "/vet", label: "Appointments" }];
const shelterLinks = [{ to: "/shelter", label: "Listings" }];
const adminLinks = [
  { to: "/admin", label: "Analytics" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/pets", label: "Pets" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/appointments", label: "Appointments" },
  { to: "/admin/adoptions", label: "Adoptions" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/banners", label: "Banners" },
];

export default function App() {
  const { loading, user } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <>
      {user && <AiChatWidget />}
      <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vets" element={<Vets />} />
        <Route path="/adoption" element={<Adoption />} />
        <Route path="/adoption/:id" element={<AdoptionDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/care" element={<CareGuide />} />
        <Route path="/care/:slug" element={<CareArticleDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Home />} />
      </Route>

      {/* Pet owner dashboard */}
      <Route element={<ProtectedRoute roles={["owner"]} />}>
        <Route element={<DashboardLayout links={ownerLinks} />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/pets" element={<MyPets />} />
          <Route path="/dashboard/pets/:id/health" element={<PetHealth />} />
          <Route path="/dashboard/appointments" element={<MyAppointments />} />
          <Route path="/dashboard/appointments/book" element={<BookAppointment />} />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/orders" element={<MyOrders />} />
        </Route>
      </Route>

      {/* Veterinarian dashboard */}
      <Route element={<ProtectedRoute roles={["veterinarian"]} />}>
        <Route element={<DashboardLayout links={vetLinks} />}>
          <Route path="/vet" element={<VetDashboard />} />
        </Route>
      </Route>

      {/* Shelter dashboard */}
      <Route element={<ProtectedRoute roles={["shelter"]} />}>
        <Route element={<DashboardLayout links={shelterLinks} />}>
          <Route path="/shelter" element={<ShelterDashboard />} />
        </Route>
      </Route>

      {/* Admin dashboard */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<DashboardLayout links={adminLinks} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/pets" element={<AdminPets />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/adoptions" element={<AdminAdoptions />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}

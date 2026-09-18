import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import AnnouncementBar from "../components/layout/AnnouncementBar.jsx";
import ScrollBackground from "../components/3d/ScrollBackground.jsx";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ScrollBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

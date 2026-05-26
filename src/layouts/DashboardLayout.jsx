import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [userRole, setUserRole] = useState("user");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // User এর role বের করো
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`https://local-chef-bazaar-server-inky.vercel.app/users/${user.email}`)
        .then((res) => setUserRole(res.data?.role || "user"));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  // Role অনুযায়ী nav links
  const userLinks = (
    <>
      <SidebarLink to="/dashboard/my-profile" icon="👤" label="My Profile" />
      <SidebarLink to="/dashboard/my-orders" icon="📦" label="My Orders" />
      <SidebarLink to="/dashboard/my-reviews" icon="⭐" label="My Reviews" />
      <SidebarLink to="/dashboard/favorite-meals" icon="❤️" label="Favorite Meals" />
    </>
  );

  const chefLinks = (
    <>
      <SidebarLink to="/dashboard/my-profile" icon="👤" label="My Profile" />
      <SidebarLink to="/dashboard/create-meal" icon="🍳" label="Create Meal" />
      <SidebarLink to="/dashboard/my-meals" icon="🍽" label="My Meals" />
      <SidebarLink to="/dashboard/order-requests" icon="📋" label="Order Requests" />
    </>
  );

  const adminLinks = (
    <>
      <SidebarLink to="/dashboard/my-profile" icon="👤" label="My Profile" />
      <SidebarLink to="/dashboard/manage-users" icon="👥" label="Manage Users" />
      <SidebarLink to="/dashboard/manage-requests" icon="📩" label="Manage Requests" />
      <SidebarLink to="/dashboard/statistics" icon="📊" label="Statistics" />
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== Sidebar ===== */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:flex`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700">
          <p className="text-xl font-bold text-orange-400">🍲 LocalChefBazaar</p>
          <p className="text-xs text-gray-400 mt-1 capitalize">
            {userRole} Dashboard
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700">
          <img
            src={user?.photoURL || "https://i.ibb.co/default.jpg"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-400"
          />
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[130px]">
              {user?.displayName}
            </p>
            <p className="text-xs text-gray-400 truncate max-w-[130px]">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {userRole === "admin"
            ? adminLinks
            : userRole === "chef"
            ? chefLinks
            : userLinks}

          {/* Divider */}
          <div className="border-t border-gray-700 my-3"></div>

          {/* Home Link */}
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition text-sm"
          >
            🏠 <span>Back to Home</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-900 hover:text-red-300 transition text-sm"
          >
            🚪 <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between md:hidden">
          <p className="text-orange-600 font-bold">🍲 Dashboard</p>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 text-2xl focus:outline-none"
          >
            ☰
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Reusable Sidebar Link Component
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
        isActive
          ? "bg-orange-500 text-white font-semibold"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`
    }
  >
    <span>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default DashboardLayout;
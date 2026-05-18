import { useContext } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-lg">
            🍽️
          </div>
          <span className="text-lg font-bold text-gray-900">
            Local<span className="text-orange-500">Chef</span>Bazaar
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium pb-1 border-b-2 transition-colors ${
                isActive
                  ? "text-orange-500 border-orange-500"
                  : "text-gray-600 border-transparent hover:text-orange-500"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/meals"
            className={({ isActive }) =>
              `text-sm font-medium pb-1 border-b-2 transition-colors ${
                isActive
                  ? "text-orange-500 border-orange-500"
                  : "text-gray-600 border-transparent hover:text-orange-500"
              }`
            }
          >
            Meals
          </NavLink>
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium pb-1 border-b-2 transition-colors ${
                  isActive
                    ? "text-orange-500 border-orange-500"
                    : "text-gray-600 border-transparent hover:text-orange-500"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || "https://i.ibb.co/default-avatar.jpg"}
                alt="Profile"
                title={user.displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-orange-200"
              />
              <button
                onClick={logOut}
                className="px-4 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 border-2 border-orange-500 rounded-lg hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
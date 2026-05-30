import { Link, NavLink } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth()
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  // নেভিগেশন লিঙ্কস
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold bg-transparent" : "text-gray-700 hover:text-orange-500 bg-transparent"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/meals"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold bg-transparent" : "text-gray-700 hover:text-orange-500 bg-transparent"
          }
        >
          Meals
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-semibold bg-transparent" : "text-gray-700 hover:text-orange-500 bg-transparent"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto px-4">
        
        {/* Navbar Start: Mobile Menu & Logo */}
        <div className="navbar-start">
          <div className="dropdown z-50">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-gray-100"
            >
              {navLinks}
            </ul>
          </div>
          
          {/* Logo (সব স্ক্রিনেই নাম শো করবে) */}
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-lg shrink-0">
              🍽️
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900">
              Local<span className="text-orange-500">Chef</span>Bazaar
            </span>
          </Link>
        </div>

        {/* Navbar Center: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2 px-1">
            {navLinks}
          </ul>
        </div>

        {/* Navbar End: Auth Options */}
        <div className="navbar-end gap-2">
          {user ? (
            /* User Profile Dropdown */
            <div className="dropdown dropdown-end z-50">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-orange-400">
                <div className="w-10 rounded-full">
                  <img 
                    alt="Profile" 
                    src={user.photoURL || "https://i.ibb.co/default-avatar.jpg"} 
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-56 p-4 shadow-xl border border-gray-100">
                <li className="mb-2 px-2">
                  <p className="font-bold text-orange-500 p-0">{user.displayName || "User Name"}</p>
                  <p className="text-xs text-gray-500 break-all p-0">{user.email}</p>
                </li>
                <hr className="my-2 border-gray-200" />
                <li>
                  <button onClick={handleLogout} className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white w-full mt-2 normal-case border-none">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* Login / Register Buttons */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 btn-xs sm:btn-sm font-medium normal-case"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn bg-orange-500 hover:bg-orange-600 text-white btn-xs sm:btn-sm font-medium normal-case border-none"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
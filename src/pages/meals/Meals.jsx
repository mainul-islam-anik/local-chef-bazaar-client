import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMeals, setTotalMeals] = useState(0);
  const [search, setSearch] = useState("");         // ✅ search state
  const [searchInput, setSearchInput] = useState(""); // ✅ input state
  const itemsPerPage = 10;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Meals | LocalChefBazaar";
  }, []);

  useEffect(() => {
    const skip = (currentPage - 1) * itemsPerPage;
    axios
      .get(
        `https://local-chef-bazaar-server-inky.vercel.app/meals?skip=${skip}&limit=${itemsPerPage}&sort=${sortOrder}&search=${encodeURIComponent(search)}`
      )
      .then((res) => {
        setMeals(res.data.meals);
        setTotalMeals(res.data.total);
      });
  }, [currentPage, sortOrder, search]); // ✅ search dependency

  const totalPages = Math.ceil(totalMeals / itemsPerPage);

  // ✅ Search submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1); // search করলে page 1 এ যাবে
  };

  // ✅ Search clear handler
  const handleClear = () => {
    setSearch("");
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleSeeDetails = (id) => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate(`/meals/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        All Meals
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Discover fresh homemade meals from local chefs
      </p>

      {/* ===== Search + Sort Bar ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by meal name or chef name..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {/* Clear button */}
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition"
          >
            🔍 Search
          </button>
        </form>

        {/* Sort Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="default">Default Order</option>
          <option value="asc">Price: Low to High ↑</option>
          <option value="desc">Price: High to Low ↓</option>
        </select>
      </div>

      {/* Search Result Info */}
      {search && (
        <div className="mb-4 flex items-center gap-2">
          <p className="text-gray-600 text-sm">
            🔍 Search results for:{" "}
            <span className="font-semibold text-orange-600">"{search}"</span>
            {" "}— {totalMeals} results found
          </p>
          <button
            onClick={handleClear}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* ===== Meals Grid ===== */}
      {meals.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🍽</p>
          <p className="text-lg font-medium">No meals found!</p>
          {search && (
            <p className="text-sm mt-2">
              Try searching with a different keyword.
            </p>
          )}
          {search && (
            <button
              onClick={handleClear}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
            >
              Show All Meals
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={meal.foodImage}
                  alt={meal.foodName}
                  className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-bold text-orange-600 shadow">
                  ৳{meal.price}
                </div>
              </div>

              <div className="p-4">
                {/* Meal Name — search text highlight করুন */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {highlightText(meal.foodName, search)}
                </h3>
                <p className="text-sm text-gray-500">
                  👨‍🍳 {highlightText(meal.chefName, search)}
                </p>
                <p className="text-sm text-gray-400">🪪 {meal.chefId}</p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-yellow-500 text-sm">
                    ⭐ {meal.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    📍 {meal.deliveryArea}
                  </span>
                </div>

                <button
                  onClick={() => handleSeeDetails(meal._id)}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-sm font-medium transition"
                >
                  See Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-40 hover:bg-orange-50 transition"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-xl border transition ${
                currentPage === page
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-300 hover:bg-orange-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-40 hover:bg-orange-50 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ Search text highlight helper function
const highlightText = (text, search) => {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 text-yellow-800 rounded px-0.5">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default Meals;
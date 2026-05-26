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
  const itemsPerPage = 10;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Meals | LocalChefBazaar";
  }, []);

  useEffect(() => {
    const skip = (currentPage - 1) * itemsPerPage;
    axios
      .get(`https://local-chef-bazaar-server-inky.vercel.app//meals?skip=${skip}&limit=${itemsPerPage}&sort=${sortOrder}`)
      .then((res) => {
        setMeals(res.data.meals);
        setTotalMeals(res.data.total);
      });
  }, [currentPage, sortOrder]);

  const totalPages = Math.ceil(totalMeals / itemsPerPage);

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
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">All Meals</h2>
      <p className="text-center text-gray-500 mb-6">
        Discover fresh homemade meals from local chefs
      </p>

      {/* Sort Button */}
      <div className="flex justify-end mb-6">
        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="default">Default Order</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{meal.foodName}</h3>
              <p className="text-sm text-gray-500">Chef: {meal.chefName}</p>
              <p className="text-sm text-gray-400">Chef ID: {meal.chefId}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-orange-600 font-bold">৳{meal.price}</span>
                <span className="text-yellow-500 text-sm">⭐ {meal.rating}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">📍 {meal.deliveryArea}</p>
              <button
                onClick={() => handleSeeDetails(meal._id)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10 flex-wrap">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-orange-50 transition"
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg border transition ${
              currentPage === page
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-300 hover:bg-orange-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-orange-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Meals;
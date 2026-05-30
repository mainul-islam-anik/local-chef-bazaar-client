import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const DailyMeals = () => {
  const [meals, setMeals] = useState([]);
  const {user}= useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    // Server থেকে ৬টি meal আনো
    axios.get("https://local-chef-bazaar-server-inky.vercel.app/daily-meals").then((res) => {
      setMeals(res.data);
    })
    .catch((err) => {
      console.error("Daily-meals error:", err);
    });
  }, []);
  const handleSeeDetails = (id) => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate(`/meals/${id}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
        Today's Special Meals
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
        Fresh, homemade meals prepared by our talented local chefs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
         <div
              key={meal._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-1 dark:text-white">
                  {meal.foodName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  👨‍🍳 {meal.chefName}
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

      <div className="text-center mt-10">
        <Link
          to="/meals"
          className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full font-semibold transition"
        >
          View All Meals
        </Link>
      </div>
    </section>
  );
};

export default DailyMeals;
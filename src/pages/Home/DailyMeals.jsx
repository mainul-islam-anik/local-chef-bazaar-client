import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const DailyMeals = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    // Server থেকে ৬টি meal আনো
    axios.get("http://localhost:5000/daily-meals").then((res) => {
      setMeals(res.data);
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Today's Special Meals
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Fresh, homemade meals prepared by our talented local chefs
      </p>

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
              <p className="text-sm text-gray-500">Chef ID: {meal.chefId}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-orange-600 font-bold text-lg">
                  ৳{meal.price}
                </span>
                <span className="text-yellow-500 text-sm">⭐ {meal.rating}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">📍 {meal.deliveryArea}</p>
              <Link
                to={`/meals/${meal._id}`}
                className="mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                See Details
              </Link>
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
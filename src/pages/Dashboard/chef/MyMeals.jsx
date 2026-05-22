import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const MyMeals = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    document.title = "My Meals | Chef Dashboard";
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/my-meals/${user.email}`)
      .then((res) => {
        setMeals(res.data);
        setLoading(false);
      });
  }, [user.email]);

  // Delete meal
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Meal?",
      text: "This meal will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete!",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:5000/meals/${id}`);
      setMeals((prev) => prev.filter((m) => m._id !== id));
      toast.success("Meal deleted successfully!");
    }
  };

  // Update button click
  const handleEditClick = (meal) => {
    setEditingMeal(meal);
    setValue("foodName", meal.foodName);
    setValue("price", meal.price);
    setValue("estimatedDeliveryTime", meal.estimatedDeliveryTime);
    setValue("chefExperience", meal.chefExperience);
    setValue("deliveryArea", meal.deliveryArea);
    setValue("ingredients", meal.ingredients?.join(", "));
  };

  // Update submit
  const onUpdateSubmit = async (data) => {
    const updatedData = {
      foodName: data.foodName,
      price: parseFloat(data.price),
      estimatedDeliveryTime: data.estimatedDeliveryTime,
      chefExperience: data.chefExperience,
      deliveryArea: data.deliveryArea,
      ingredients: data.ingredients.split(",").map((i) => i.trim()),
    };

    await axios.patch(
      `http://localhost:5000/meals/${editingMeal._id}`,
      updatedData
    );

    setMeals((prev) =>
      prev.map((m) =>
        m._id === editingMeal._id ? { ...m, ...updatedData } : m
      )
    );

    toast.success("Meal updated successfully!");
    setEditingMeal(null);
    reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-bounce">🍲</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🍽 My Meals ({meals.length})
      </h2>

      {meals.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🍽</p>
          <p className="text-lg">No meals created yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition"
            >
              <img
                src={meal.foodImage}
                alt={meal.foodName}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{meal.foodName}</h3>
                <p className="text-orange-600 font-bold">৳{meal.price}</p>
                <p className="text-yellow-500 text-sm">⭐ {meal.rating}</p>
                <p className="text-gray-500 text-xs mt-1">
                  📍 {meal.deliveryArea}
                </p>
                <p className="text-gray-500 text-xs">
                  ⏱ {meal.estimatedDeliveryTime}
                </p>
                <p className="text-gray-500 text-xs">
                  🪪 {meal.chefId}
                </p>

                {/* Ingredients */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {meal.ingredients?.slice(0, 3).map((ing, i) => (
                    <span
                      key={i}
                      className="bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded-full"
                    >
                      {ing}
                    </span>
                  ))}
                  {meal.ingredients?.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{meal.ingredients.length - 3} more
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditClick(meal)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    ✏️ Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Update Modal ===== */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✏️ Update Meal
            </h3>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-3">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  {...register("foodName", { required: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...register("price", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Area
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...register("deliveryArea")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  {...register("ingredients")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...register("estimatedDeliveryTime")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...register("chefExperience")}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingMeal(null); reset(); }}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeals;
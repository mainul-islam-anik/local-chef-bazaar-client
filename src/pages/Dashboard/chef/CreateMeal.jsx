import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const CreateMeal = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = "Create Meal | Chef Dashboard";
  }, []);

  // Chef info আনো (chefId দরকার)
  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${user.email}`)
      .then((res) => setUserInfo(res.data));
  }, [user.email]);

  // Fraud chef meal create করতে পারবে না
  if (userInfo?.status === "fraud") {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div>
          <p className="text-5xl mb-4">🚫</p>
          <p className="text-red-500 text-xl font-bold">Access Denied!</p>
          <p className="text-gray-500 mt-2">
            Your account has been marked as fraud.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    // Image upload — imgbb তে
    const imageFile = data.foodImage[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    const imgRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_key
      }`,
      formData
    );

    const imageUrl = imgRes.data.data.url;

    // Ingredients string কে array তে convert করো
    const ingredientsArray = data.ingredients
      .split(",")
      .map((item) => item.trim());

    const mealData = {
      foodName: data.foodName,
      chefName: data.chefName,
      foodImage: imageUrl,
      price: parseFloat(data.price),
      rating: 0,
      ingredients: ingredientsArray,
      estimatedDeliveryTime: data.estimatedDeliveryTime,
      chefExperience: data.chefExperience,
      chefId: userInfo?.chefId,
      deliveryArea: data.deliveryArea,
      userEmail: user.email,
      createdAt: new Date(),
    };

    const res = await axios.post("http://localhost:5000/meals", mealData);

    if (res.data.insertedId) {
      toast.success("Meal created successfully! 🍽");
      reset();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🍳 Create New Meal
      </h2>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Food Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              placeholder="e.g. Chicken Biriyani"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("foodName", { required: "Food name is required" })}
            />
            {errors.foodName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.foodName.message}
              </p>
            )}
          </div>

          {/* Chef Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chef Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("chefName", { required: "Chef name is required" })}
            />
            {errors.chefName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.chefName.message}
              </p>
            )}
          </div>

          {/* Food Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-700"
              {...register("foodImage", { required: "Food image is required" })}
            />
            {errors.foodImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.foodImage.message}
              </p>
            )}
          </div>

          {/* Price & Rating Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (৳)
              </label>
              <input
                type="number"
                placeholder="120"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Area
              </label>
              <input
                type="text"
                placeholder="e.g. Mirpur, Dhaka"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                {...register("deliveryArea", {
                  required: "Delivery area is required",
                })}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients{" "}
              <span className="text-gray-400 text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="Chicken, Rice, Spices, Oil"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("ingredients", {
                required: "Ingredients are required",
              })}
            />
            {errors.ingredients && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ingredients.message}
              </p>
            )}
          </div>

          {/* Delivery Time & Experience Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                placeholder="e.g. 30 minutes"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                {...register("estimatedDeliveryTime", {
                  required: "Delivery time is required",
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chef Experience
              </label>
              <input
                type="text"
                placeholder="e.g. 5 years"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                {...register("chefExperience", {
                  required: "Experience is required",
                })}
              />
            </div>
          </div>

          {/* Chef ID — read only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chef ID
            </label>
            <input
              type="text"
              value={userInfo?.chefId || "Loading..."}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* User Email — read only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="text"
              value={user?.email}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            🍽 Create Meal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeal;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Page title
  useEffect(() => {
    document.title = meal ? `${meal.foodName} | LocalChefBazaar` : "Meal Details";
  }, [meal]);

  // Meal data আনো
  useEffect(() => {
    axios.get(`http://localhost:5000/meals/${id}`).then((res) => {
      setMeal(res.data);
      setLoading(false);
    });
  }, [id]);

  // Reviews আনো
  useEffect(() => {
    axios.get(`http://localhost:5000/reviews/${id}`).then((res) => {
      setReviews(res.data);
    });
  }, [id]);

  // Favorite এ যোগ করা
  const handleAddFavorite = async () => {
    const favData = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
      addedTime: new Date(),
    };

    const res = await axiosSecure.post("/favorites", favData);

    if (res.data.message === "Already in favorites") {
      toast.error("This meal is already in your favorites!");
    } else {
      toast.success("Meal added to favorites! ❤️");
    }
  };

  // Review submit করা
  const onReviewSubmit = async (data) => {
    const reviewData = {
      foodId: id,
      reviewerName: user.displayName,
      reviewerImage: user.photoURL,
       reviewerEmail: user.email,
      rating: parseInt(data.rating),
      comment: data.comment,
      date: new Date(),
    };

    await axiosSecure.post("/reviews", reviewData);

    // নতুন review তাৎক্ষণিকভাবে দেখাও
    setReviews((prev) => [reviewData, ...prev]);
    reset();
    toast.success("Review submitted successfully! ✅");
  };

  // Order Now বাটনে click
  const handleOrderNow = () => {
    navigate("/order", { state: { meal } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🍲</div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Meal not found!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ===== Meal Info Section ===== */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden md:flex gap-0">

        {/* Food Image */}
        <div className="md:w-1/2">
          <img
            src={meal.foodImage}
            alt={meal.foodName}
            className="w-full h-72 md:h-full object-cover"
          />
        </div>

        {/* Food Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">{meal.foodName}</h1>
            <p className="text-yellow-500 text-lg mb-4">⭐ {meal.rating}</p>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-700">👨‍🍳 Chef:</span> {meal.chefName}</p>
              <p><span className="font-semibold text-gray-700">🪪 Chef ID:</span> {meal.chefId}</p>
              <p><span className="font-semibold text-gray-700">💰 Price:</span>{" "}
                <span className="text-orange-600 font-bold text-base">৳{meal.price}</span>
              </p>
              <p><span className="font-semibold text-gray-700">📍 Delivery Area:</span> {meal.deliveryArea}</p>
              <p><span className="font-semibold text-gray-700">⏱ Estimated Delivery:</span> {meal.estimatedDeliveryTime}</p>
              <p><span className="font-semibold text-gray-700">🏆 Chef Experience:</span> {meal.chefExperience}</p>
            </div>

            {/* Ingredients */}
            <div className="mt-4">
              <p className="font-semibold text-gray-700 mb-1">🥗 Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {meal.ingredients?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleOrderNow}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
            >
              🛒 Order Now
            </button>
            <button
              onClick={handleAddFavorite}
              className="flex-1 border-2 border-red-400 text-red-500 hover:bg-red-50 py-3 rounded-xl font-semibold transition"
            >
              ❤️ Favorite
            </button>
          </div>
        </div>
      </div>

      {/* ===== Reviews Section ===== */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {/* Existing Reviews */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4 mb-10">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="bg-white rounded-xl shadow-sm p-5 flex gap-4"
              >
                <img
                  src={review.reviewerImage || "https://i.ibb.co/default.jpg"}
                  alt={review.reviewerName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-yellow-500 text-sm mb-1">
                    {"⭐".repeat(review.rating)}
                  </p>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Give Review Form ===== */}
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">✍️ Give a Review</h3>

          <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4">

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                {...register("rating", { required: "Please select a rating" })}
              >
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                <option value="4">⭐⭐⭐⭐ - Very Good</option>
                <option value="3">⭐⭐⭐ - Good</option>
                <option value="2">⭐⭐ - Fair</option>
                <option value="1">⭐ - Poor</option>
              </select>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Comment
              </label>
              <textarea
                rows={4}
                placeholder="Share your experience with this meal..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                {...register("comment", {
                  required: "Comment is required",
                  minLength: {
                    value: 10,
                    message: "Comment must be at least 10 characters",
                  },
                })}
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
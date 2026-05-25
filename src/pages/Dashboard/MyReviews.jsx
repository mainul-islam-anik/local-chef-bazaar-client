import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "My Reviews | Dashboard";
  }, []);

  useEffect(() => {
    axiosSecure
      .get(`/my-reviews/${user.email}`)
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      });
  }, [user.email]);

  // Delete review
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete!",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted successfully!");
    }
  };

  // Update button click — modal এ data load করো
  const handleEditClick = (review) => {
    setEditingReview(review);
    setValue("rating", review.rating);
    setValue("comment", review.comment);
  };

  // Update submit
  const onUpdateSubmit = async (data) => {
    await axiosSecure.patch(`/reviews/${editingReview._id}`, {
      rating: parseInt(data.rating),
      comment: data.comment,
    });

    // Locally update
    setReviews((prev) =>
      prev.map((r) =>
        r._id === editingReview._id
          ? { ...r, rating: parseInt(data.rating), comment: data.comment }
          : r
      )
    );

    toast.success("Review updated successfully!");
    setEditingReview(null);
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
        ⭐ My Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg">No reviews yet!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">
                    🍽 {review.mealName || "Meal"}
                  </h3>
                  <p className="text-yellow-500 text-sm mb-1">
                    {"⭐".repeat(review.rating)}
                  </p>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    📅 {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    ✏️ Update
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg text-xs font-medium transition"
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
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✏️ Update Review
            </h3>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  {...register("rating", { required: "Rating is required" })}
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Very Good</option>
                  <option value="3">⭐⭐⭐ Good</option>
                  <option value="2">⭐⭐ Fair</option>
                  <option value="1">⭐ Poor</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  {...register("comment", { required: "Comment is required" })}
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingReview(null); reset(); }}
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

export default MyReviews;
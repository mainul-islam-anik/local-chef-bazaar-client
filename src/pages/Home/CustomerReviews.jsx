import { useEffect, useState } from "react";
import axios from "axios";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get("https://local-chef-bazaar-server-inky.vercel.app//reviews").then((res) => {
      setReviews(res.data);
    });
  }, []);

  return (
    <section className="bg-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          What Our Customers Say
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Real reviews from real food lovers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.reviewerImage}
                  alt={review.reviewerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                  <p className="text-yellow-500 text-sm">
                    {"⭐".repeat(review.rating)}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
              <p className="text-gray-400 text-xs mt-3">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
// import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

const MealCard = ({ meal }) => (
  <motion.div whileHover={{ y: -5 }} className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-all">
    <figure>
      <img src={meal.foodImage} alt={meal.foodName} className="h-44 w-full object-cover" />
    </figure>
    <div className="card-body p-4">
      <h2 className="card-title text-base">{meal.foodName}</h2>
      <p className="text-xs text-base-content/50">By {meal.chefName} • ID: {meal.chefId}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-orange-500 font-bold text-lg">৳{meal.price}</span>
        <div className="badge badge-warning badge-outline">⭐ {meal.rating}</div>
      </div>
      <p className="text-xs text-base-content/40">📍 {meal.deliveryArea}</p>
      <div className="card-actions mt-2">
        <Link to={`/meals/${meal._id}`} className="btn btn-warning btn-sm w-full text-white">
          See Details
        </Link>
      </div>
    </div>
  </motion.div>
);

const ReviewCard = ({ review }) => (
  <div className="card bg-base-100 shadow-sm border border-base-200">
    <div className="card-body p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img src={review.reviewerImage} alt={review.reviewerName} />
          </div>
        </div>
        <div>
          <p className="font-bold text-sm">{review.reviewerName}</p>
          <p className="text-xs text-base-content/40">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="rating rating-sm mb-2">
        {[1,2,3,4,5].map(n => (
          <input key={n} type="radio" className="mask mask-star-2 bg-orange-400"
            defaultChecked={n === review.rating} disabled />
        ))}
      </div>
      <p className="text-sm text-base-content/70 leading-relaxed">{review.comment}</p>
    </div>
  </div>
);

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/meals?limit=6`)
      .then(res => setMeals(res.data));
    axios.get(`${import.meta.env.VITE_API_URL}/reviews`)
      .then(res => setReviews(res.data));
  }, []);

  return (
    <div>

      {/* ===== HERO ===== */}
      <section className="hero min-h-[88vh] bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-6xl mx-auto px-6 py-16">

          {/* Floating food image */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-72 h-72 lg:w-96 lg:h-96 bg-orange-200 rounded-full flex items-center justify-center text-9xl shadow-2xl flex-shrink-0"
          >
            🍛
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="badge badge-warning badge-outline mb-4 font-semibold">
              🏠 Home Cooked Goodness
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Fresh Meals from <br />
              Local <span className="text-orange-500">Home Chefs</span>
            </h1>
            <p className="text-base-content/60 text-lg leading-relaxed mb-8 max-w-lg">
              Discover authentic homemade food cooked with love by talented local chefs in your area. Healthy, affordable, and delivered fast.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/meals" className="btn btn-warning text-white btn-lg shadow-lg">
                🍴 Explore Meals
              </Link>
              <Link to="/register" className="btn btn-outline btn-warning btn-lg">
                Become a Chef
              </Link>
            </div>

            {/* Stats */}
            <div className="stats stats-horizontal shadow mt-10 bg-base-100">
              <div className="stat place-items-center py-3 px-6">
                <div className="stat-value text-orange-500 text-2xl">200+</div>
                <div className="stat-desc">Home Chefs</div>
              </div>
              <div className="stat place-items-center py-3 px-6">
                <div className="stat-value text-orange-500 text-2xl">1.2k+</div>
                <div className="stat-desc">Customers</div>
              </div>
              <div className="stat place-items-center py-3 px-6">
                <div className="stat-value text-orange-500 text-2xl">50+</div>
                <div className="stat-desc">Daily Meals</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== DAILY MEALS ===== */}
      <section className="py-20 px-6 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-2">
            Today's <span className="text-orange-500">Daily Meals</span>
          </h2>
          <p className="text-center text-base-content/50 mb-10">
            Fresh homemade meals by top local chefs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map(meal => <MealCard key={meal._id} meal={meal} />)}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-20 px-6 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-2">
            What Our <span className="text-orange-500">Customers Say</span>
          </h2>
          <p className="text-center text-base-content/50 mb-10">
            Real reviews from happy food lovers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(review => <ReviewCard key={review._id} review={review} />)}
          </div>
        </div>
      </section>

      {/* ===== WHY US (Extra Section) ===== */}
      <section className="py-20 px-6 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            Why <span className="text-orange-500">LocalChefBazaar?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🏠", title: "Home Cooked Quality", desc: "Every meal is freshly prepared by verified home chefs with real ingredients." },
              { icon: "⚡", title: "Fast Delivery", desc: "Get your food delivered quickly right to your doorstep." },
              { icon: "💰", title: "Affordable Prices", desc: "Enjoy restaurant-quality food at homemade prices." },
            ].map(item => (
              <div key={item.title} className="card bg-base-100 shadow-sm text-center p-6 hover:shadow-md transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
import { motion } from "framer-motion";
import { Link } from "react-router";

const Banner = () => {
  return (
    <div
      className="min-h-[90vh] flex items-center justify-center text-white relative"
      style={{
        background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://i.ibb.co.com/GQGkv64Q/download-30.jpg') center/cover no-repeat",
      }}
    >
      <div className="text-center px-4 max-w-3xl">

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Homemade Food, <span className="text-orange-400">Delivered Fresh</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Order delicious home-cooked meals from local chefs near you
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            to="/meals"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition"
          >
            Explore Meals
          </Link>
          <Link
            to="/register"
            className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-full font-semibold text-lg transition"
          >
            Join Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
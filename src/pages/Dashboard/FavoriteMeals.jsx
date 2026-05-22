import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const FavoriteMeals = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Favorite Meals | Dashboard";
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/favorites/${user.email}`)
      .then((res) => {
        setFavorites(res.data);
        setLoading(false);
      });
  }, [user.email]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Remove this meal from favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Remove!",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:5000/favorites/${id}`);
      setFavorites((prev) => prev.filter((fav) => fav._id !== id));
      toast.success("Meal removed from favorites successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-bounce">🍲</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        ❤️ My Favorite Meals ({favorites.length})
      </h2>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">💔</p>
          <p className="text-lg">No favorite meals yet!</p>
          <p className="text-sm">Go to Meals page and add some favorites.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full text-sm bg-white">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Meal Name</th>
                <th className="py-3 px-4 text-left">Chef Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Date Added</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav, index) => (
                <tr
                  key={fav._id}
                  className="border-b border-gray-100 hover:bg-orange-50 transition"
                >
                  <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {fav.mealName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{fav.chefName}</td>
                  <td className="py-3 px-4 text-orange-600 font-semibold">
                    ৳{fav.price}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(fav.addedTime).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(fav._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavoriteMeals;
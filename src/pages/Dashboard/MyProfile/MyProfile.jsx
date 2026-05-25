import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Profile | Dashboard";
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${user.email}`)
      .then((res) => {
        setUserInfo(res.data);
        setLoading(false);
      });
  }, [user.email]);

  const handleRequest = async (requestType) => {
    const confirm = await Swal.fire({
      title: `Become a ${requestType}?`,
      text: `Send request to admin to become a ${requestType}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Send!",
    });

    if (confirm.isConfirmed) {
      const requestData = {
        userName: user.displayName,
        userEmail: user.email,
        requestType,
        requestStatus: "pending",
        requestTime: new Date(),
      };
        try {
      // ✅ সরাসরি axios দিয়ে পাঠান
      const res = await axios.post(
        "http://localhost:5000/requests",
        requestData
      );

      if (res.data.insertedId) {
        toast.success("Request sent successfully!");
      } else {
        toast.error("You already have a pending request!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
      
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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 My Profile</h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Cover / Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-28 relative">
          <img
            src={userInfo?.photoURL || user?.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white absolute -bottom-12 left-6 shadow-md"
          />
        </div>

        {/* Info Section */}
        <div className="pt-16 pb-6 px-6">

          {/* Role Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                userInfo?.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : userInfo?.role === "chef"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {userInfo?.role?.toUpperCase()}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                userInfo?.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {userInfo?.status?.toUpperCase()}
            </span>
          </div>

          {/* User Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-lg">👤</span>
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="font-semibold text-gray-800">
                  {userInfo?.name || user?.displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-lg">📧</span>
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="font-semibold text-gray-800">{userInfo?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-semibold text-gray-800">
                  {userInfo?.address || "Not provided"}
                </p>
              </div>
            </div>

            {/* Chef ID — শুধু chef হলে দেখাবে */}
            {userInfo?.role === "chef" && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <span className="text-lg">🪪</span>
                <div>
                  <p className="text-xs text-gray-400">Chef ID</p>
                  <p className="font-semibold text-blue-700">{userInfo?.chefId}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {/* chef না হলে দেখাবে */}
            {userInfo?.role !== "chef" && userInfo?.role !== "admin" && (
              <button
                onClick={() => handleRequest("chef")}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
              >
                👨‍🍳 Be a Chef
              </button>
            )}

            {/* admin না হলে দেখাবে */}
            {userInfo?.role !== "admin" && (
              <button
                onClick={() => handleRequest("admin")}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
              >
                🛡 Be an Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
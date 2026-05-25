import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "Manage Users | Admin Dashboard";
  }, []);

  useEffect(() => {
    axiosSecure.get("/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  const handleMakeFraud = async (userId, userName) => {
    const confirm = await Swal.fire({
      title: "Make Fraud?",
      text: `Are you sure you want to mark "${userName}" as fraud?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Mark Fraud!",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/users/fraud/${userId}`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status: "fraud" } : u
        )
      );

      toast.success("User marked as fraud!");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700";
      case "chef": return "bg-blue-100 text-blue-700";
      default: return "bg-green-100 text-green-700";
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
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        👥 Manage Users ({users.length})
      </h2>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-orange-50 transition"
                >
                  <td className="py-3 px-4 text-gray-500">{index + 1}</td>

                  {/* Name with Image */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={user.photoURL || "https://i.ibb.co/default.jpg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-600">{user.email}</td>

                  {/* Role Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        user.status === "fraud"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>

                  {/* Make Fraud Button */}
                  <td className="py-3 px-4">
                    {user.role === "admin" ? (
                      <span className="text-gray-300 text-xs">N/A</span>
                    ) : user.status === "fraud" ? (
                      <span className="text-xs text-red-400 font-medium">
                        Already Fraud
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMakeFraud(user._id, user.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        🚫 Make Fraud
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
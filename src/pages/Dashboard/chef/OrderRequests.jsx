import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const OrderRequests = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chefId, setChefId] = useState(null);
  const [notChef, setNotChef] = useState(false); // ← নতুন
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "Order Requests | Chef Dashboard";
  }, []);

  // Chef ID বের করো
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/users/${user.email}`)
      .then((res) => {
        const fetchedChefId = res.data?.chefId;

        if (!fetchedChefId) {
          // chefId নেই মানে এখনো approved chef না
          setNotChef(true);
          setLoading(false); // ← এখানে loading বন্ধ করো
          return;
        }

        setChefId(fetchedChefId);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user?.email]);

  // Chef ID পেলে orders আনো
  useEffect(() => {
    if (!chefId) return;

    axiosSecure
      .get(`/chef-orders/${chefId}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false); // ← orders পেলে loading বন্ধ
      })
      .catch(() => {
        setLoading(false);
      });
  }, [chefId]);

  // Order status update — route নাম ঠিক করা হয়েছে
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(
        `/orders/update-status/${orderId}`,
        { orderStatus: newStatus }
      );

      // Locally update করো
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );

      toast.success(`Order ${newStatus}!`);
    } catch (error) {
      toast.error("Something went wrong!",error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-bounce">🍲</div>
      </div>
    );
  }

  // Chef approved না হলে
  if (notChef) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-xl font-bold text-red-500">
          You are not an approved Chef yet!
        </p>
        <p className="text-gray-500 mt-2 text-sm">
          Please send a chef request from My Profile page and wait for admin approval.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📋 Order Requests ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">No orders yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800">{order.mealName}</h3>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Order Info */}
              <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                <p>📧 Customer:{" "}
                  <span className="font-medium">{order.userEmail}</span>
                </p>
                <p>💰 Price:{" "}
                  <span className="text-orange-600 font-bold">৳{order.price}</span>
                </p>
                <p>🔢 Quantity:{" "}
                  <span className="font-medium">{order.quantity}</span>
                </p>
                <p>📍 Address:{" "}
                  <span className="font-medium">{order.userAddress}</span>
                </p>
                <p>🕐 Time:{" "}
                  <span className="font-medium">
                    {new Date(order.orderTime).toLocaleString()}
                  </span>
                </p>
                <p>
                  💳 Payment:{" "}
                  <span className={`font-semibold ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(order._id, "cancelled")}
                  disabled={
                    order.orderStatus === "cancelled" ||
                    order.orderStatus === "accepted" ||
                    order.orderStatus === "delivered"
                  }
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✕ Cancel
                </button>

                <button
                  onClick={() => handleStatusUpdate(order._id, "accepted")}
                  disabled={
                    order.orderStatus === "accepted" ||
                    order.orderStatus === "cancelled" ||
                    order.orderStatus === "delivered"
                  }
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✓ Accept
                </button>

                <button
                  onClick={() => handleStatusUpdate(order._id, "delivered")}
                  disabled={order.orderStatus !== "accepted"}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 py-2 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🚀 Deliver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
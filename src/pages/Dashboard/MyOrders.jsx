import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "My Orders | Dashboard";
  }, []);

  useEffect(() => {
    axiosSecure
      .get(`/orders/${user.email}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      });
  }, [user.email]);

  const handlePayment = (order) => {
    // Stripe payment page এ পাঠাও
    navigate("/payment", { state: { order } });
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
        📦 My Orders ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">No orders yet!</p>
          <p className="text-sm">Go to Meals page and place your first order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-lg">{order.mealName}</h3>
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
                <p>👨‍🍳 Chef: <span className="font-medium">{order.chefName}</span></p>
                <p>🪪 Chef ID: <span className="font-medium">{order.chefId}</span></p>
                <p>💰 Price: <span className="text-orange-600 font-bold">৳{order.price}</span></p>
                <p>🔢 Quantity: <span className="font-medium">{order.quantity}</span></p>
                <p>💵 Total: <span className="text-orange-600 font-bold">
                  ৳{order.price * order.quantity}
                </span></p>
                <p>🕐 Order Time:{" "}
                  <span className="font-medium">
                    {new Date(order.orderTime).toLocaleString()}
                  </span>
                </p>

                {/* Payment Status */}
                <p>
                  💳 Payment:{" "}
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              {/* ✅ নতুন code — pending এবং delivered উভয়তেই দেখাবে */}
            {(order.orderStatus === "accepted" ||
              order.orderStatus === "pending" ||
              order.orderStatus === "delivered") &&
              order.paymentStatus === "Pending" && (
                <button
                  onClick={() => handlePayment(order)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  💳 Pay Now
                </button>
              )}
                
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
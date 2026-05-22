import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const OrderPage = () => {
  const { state } = useLocation();
  const meal = state?.meal;
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { quantity: 1 },
  });

  useEffect(() => {
    document.title = "Place Order | LocalChefBazaar";
  }, []);

  const quantity = watch("quantity", 1);
  const totalPrice = meal?.price * quantity;

  const onSubmit = async (data) => {
    // Confirm করার আগে total দেখাও
    const confirm = await Swal.fire({
      title: "Confirm Order?",
      text: `Your total price is ৳${totalPrice}. Do you want to confirm?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Order!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const orderData = {
        foodId: meal._id,
        mealName: meal.foodName,
        chefName: meal.chefName,
        price: meal.price,
        quantity: parseInt(data.quantity),
        chefId: meal.chefId,
        paymentStatus: "Pending",
        userEmail: user.email,
        userAddress: data.userAddress,
        orderStatus: "pending",
        orderTime: new Date(),
      };

      await axios.post("http://localhost:5000/orders", orderData);

      Swal.fire({
        title: "Order Placed! 🎉",
        text: "Your order has been placed successfully!",
        icon: "success",
        confirmButtonColor: "#f97316",
      });

      navigate("/dashboard/my-orders");
    }
  };

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No meal selected. Please go back.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Place Your Order</h2>
      <p className="text-gray-500 mb-6">Confirm your order details below</p>

      <div className="bg-white rounded-2xl shadow-md p-6">

        {/* Auto-filled info */}
        <div className="bg-orange-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
          <p><span className="font-semibold text-gray-700">🍽 Meal:</span> {meal.foodName}</p>
          <p><span className="font-semibold text-gray-700">👨‍🍳 Chef:</span> {meal.chefName}</p>
          <p><span className="font-semibold text-gray-700">🪪 Chef ID:</span> {meal.chefId}</p>
          <p><span className="font-semibold text-gray-700">💰 Price per item:</span> ৳{meal.price}</p>
          <p><span className="font-semibold text-gray-700">📧 Your Email:</span> {user.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum 1" },
                max: { value: 10, message: "Maximum 10" },
              })}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address
            </label>
            <textarea
              rows={3}
              placeholder="Enter your full delivery address..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              {...register("userAddress", {
                required: "Delivery address is required",
              })}
            />
            {errors.userAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.userAddress.message}</p>
            )}
          </div>

          {/* Total Price Preview */}
          <div className="bg-orange-100 rounded-xl p-4 text-center">
            <p className="text-gray-600 text-sm">Total Price</p>
            <p className="text-3xl font-bold text-orange-600">৳{totalPrice}</p>
            <p className="text-xs text-gray-500">({quantity} × ৳{meal.price})</p>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            Confirm Order 🛒
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
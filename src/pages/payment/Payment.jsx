import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router";
import { useEffect } from "react";
import CheckoutForm from "../components/CheckoutForm";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const { state } = useLocation();
  const order = state?.order;

  useEffect(() => {
    document.title = "Payment | LocalChefBazaar";
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No order found!</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        💳 Complete Payment
      </h2>
      <p className="text-gray-500 mb-6">
        Secure payment powered by Stripe
      </p>

      {/* Order Summary */}
      <div className="bg-orange-50 rounded-2xl p-4 mb-6 text-sm space-y-1">
        <p>🍽 <span className="font-semibold">{order.mealName}</span></p>
        <p>🔢 Quantity: <span className="font-semibold">{order.quantity}</span></p>
        <p>
          💰 Total:{" "}
          <span className="text-orange-600 font-bold text-lg">
            ৳{order.price * order.quantity}
          </span>
        </p>
      </div>

      {/* Stripe Form */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
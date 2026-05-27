import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const totalPrice = order.price * order.quantity;

  // make Payment Intent 
  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecure
        .post("/create-payment-intent", { price: totalPrice })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setCardError("");

    // DO Card validate 
    const { error: methodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (methodError) {
      setCardError(methodError.message);
      setProcessing(false);
      return;
    }

    // Payment confirm 
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "Anonymous",
            email: user?.email,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // Payment data save করো
      const paymentData = {
        orderId: order._id,
        mealName: order.mealName,
        userEmail: user.email,
        amount: totalPrice,
        transactionId: paymentIntent.id,
        paymentTime: new Date(),
      };

      await axiosSecure.post("/payments", paymentData);

      setProcessing(false);
      toast.success("Payment successful! 🎉");

      // Payment success page এ পাঠাও
      navigate("/payment-success", {
        state: {
          transactionId: paymentIntent.id,
          amount: totalPrice,
          mealName: order.mealName,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-xl p-4 focus-within:ring-2 focus-within:ring-orange-400 transition">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>

        {/* Card Error */}
        {cardError && (
          <p className="text-red-500 text-sm mt-2">{cardError}</p>
        )}
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 rounded-xl p-3 mb-4 text-xs text-blue-600">
        <p className="font-semibold mb-1">🧪 Test Card:</p>
        <p>Card: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date | CVC: Any 3 digits</p>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 font-medium">Total Amount:</span>
        <span className="text-orange-600 font-bold text-xl">
          ৳{totalPrice}
        </span>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-lg transition"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" fill="none"
              />
              <path
                className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ৳${totalPrice}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
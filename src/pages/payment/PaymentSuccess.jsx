import { useEffect } from "react";
import { Link, useLocation } from "react-router";

const PaymentSuccess = () => {
  const { state } = useLocation();

  useEffect(() => {
    document.title = "Payment Successful | LocalChefBazaar";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">

        {/* Success Icon */}
        <div className="text-6xl mb-4">🎉</div>

        <h2 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-500 mb-6">
          Your order has been confirmed and is being prepared.
        </p>

        {/* Transaction Details */}
        <div className="bg-green-50 rounded-xl p-4 mb-6 text-sm text-left space-y-2">
          <p>🍽 Meal:{" "}
            <span className="font-semibold">{state?.mealName}</span>
          </p>
          <p>💰 Amount Paid:{" "}
            <span className="text-green-600 font-bold">৳{state?.amount}</span>
          </p>
          <p className="break-all">🔖 Transaction ID:{" "}
            <span className="font-mono text-xs text-gray-600">
              {state?.transactionId}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            to="/dashboard/my-orders"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold transition text-sm"
          >
            View My Orders
          </Link>
          <Link
            to="/meals"
            className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 py-2.5 rounded-xl font-semibold transition text-sm"
          >
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
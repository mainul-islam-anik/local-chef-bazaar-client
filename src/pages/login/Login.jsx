import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router"; // ✅ react-router-dom
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user, logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  if (user) {
    return <Navigate to={from} replace={true} />;
  }

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      await logIn(email, password);

      Swal.fire({
        title: "Welcome Back! 🎉",
        text: "Login successful!",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });

    } catch (error) {
      let errorMessage = "Something went wrong!";

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        errorMessage = "Invalid email or password!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address!";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Try again later!";
      }

      Swal.fire({
        title: "Login Failed! ❌",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Login to your LocalChefBazaar account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
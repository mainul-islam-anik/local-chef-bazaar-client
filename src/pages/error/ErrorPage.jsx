import { useEffect } from "react";
import { Link } from "react-router";

const ErrorPage = () => {
  useEffect(() => {
    document.title = "404 | Page Not Found";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-center px-4">
      <h1 className="text-8xl font-bold text-orange-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Oops! Page Not Found</h2>
      <p className="text-gray-500 mt-2">The page you are looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
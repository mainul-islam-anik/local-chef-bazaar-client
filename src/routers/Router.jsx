import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/login/login";
import Register from "../pages/registration/registration";
import Meals from "../pages/meals/Meals";
import PrivateRoute from "./PrivateRoute";
import MealDetails from "../pages/mealsDetails/MealDetails";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/error/ErrorPage";
import OrderPage from "../pages/order/OrderPage";

export const router = createBrowserRouter([
   // ===== Main Layout =====
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/meals", element: <Meals /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      // Private Routes
      {
        path: "/meals/:id",
        element: (
          <PrivateRoute>
            <MealDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/order",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ===== Dashboard Layout =====
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ---- User Routes ----
      { path: "my-profile", element: <MyProfile /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "my-reviews", element: <MyReviews /> },
      { path: "favorite-meals", element: <FavoriteMeals /> },  // ← এটা

      // ---- Chef Routes (পরে যোগ হবে) ----
      // { path: "create-meal", element: <CreateMeal /> },
      // { path: "my-meals", element: <MyMeals /> },
      // { path: "order-requests", element: <OrderRequests /> },

      // ---- Admin Routes (পরে যোগ হবে) ----
      // { path: "manage-users", element: <ManageUsers /> },
      // { path: "manage-requests", element: <ManageRequests /> },
      // { path: "statistics", element: <Statistics /> },
    ],
  },
]);
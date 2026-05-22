import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/login/login";
import Register from "../pages/registration/registration";
import Meals from "../pages/meals/Meals";
import PrivateRoute from "./PrivateRoute";
import MealDetails from "../pages/mealsDetails/MealDetails";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/error/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        { 
          path: "/login", 
          Component: Login
        },
        { 
          path: "/register",
          Component: Register
        },
        { path: "/meals",
          Component: Meals
        },
        {
        // Private route — login ছাড়া access নেই
        path: "/meals/:id",
        element:
          <PrivateRoute>
            <MealDetails />
          </PrivateRoute> 
      },
    ]
  },
  // {
  //   path: "/dashboard",
  //   element: (
  //     <PrivateRoute>
  //       <DashboardLayout />
  //     </PrivateRoute>
  //   ),
  //   children: [
  //     // Dashboard routes পরে যুক্ত হবে
  //   ],
  // }
]);
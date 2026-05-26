import axios from "axios";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://local-chef-bazaar-server-inky.vercel.app",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // ✅ useEffect এর ভেতরে রাখলে
    // বারবার যোগ হবে না

    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          await logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // ✅ Cleanup — component unmount হলে interceptors সরিয়ে দাও
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
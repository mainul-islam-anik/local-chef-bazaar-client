import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch} = useForm();
  const { registerUser, updateUserProfile } = useAuth()
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const profileImg = data.photo[0];
    const { name, email, password, address } = data;

    try {
      // ১. Firebase এ user তৈরি করো
      const result = await registerUser(email, password);
       console.log("after return result",result.user)
        // 1.store the image and get the photo url
        const formData = new FormData()
        formData.append('image',profileImg)
        // 2. send the photo to store and get the url
        const image_API_URL =`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`
        axios.post(image_API_URL,formData)
        .then(res => {
            const photoURL= res.data.data.url;

      // ৩. MongoDB তে user save করো

    const userInfo = {
        name,
        email,
        address,
        photoURL,
        role: "user",       // default role
        status: "active",   // default status
      };

      axios.post("https://local-chef-bazaar-server-inky.vercel.app//users", userInfo);

      toast.success("Registration successful! Welcome!");
      navigate("/");

            // ২. Profile update করো in firebase
            const userProfile ={
                displayName: data.name ,
                photoURL: photoURL
            }
            updateUserProfile(userProfile)
            .then(()=> {
                console.log('user profile updated done')
            })
            .catch(error => console.log(error))
        })

    } catch (error) {
      toast.error(error.message);
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join LocalChefBazaar today!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              placeholder="Your Photo"
              className="file-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("photo", { required: "Photo is required" })}
            />
            {errors.photoURL && (
              <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Your address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                  message: "Must have uppercase letter and special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Register Now
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
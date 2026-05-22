import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth } from "../../Firebase/firebase.config";
import { useEffect, useState } from "react";
// import axios from "axios";

const AuthProvider = ({children}) => { 

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update profile (name + photo)
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser,  profile )
  };

  // Login
  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Observer — user state change হলে JWT নাও
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // if (currentUser) {
      //   // JWT token নাও server থেকে
      //   try {
      //     const res = await axios.post(
      //       `${import.meta.env.VITE_API_URL}/jwt`,
      //       { email: currentUser.email },
      //       { withCredentials: true }
      //     );
      //     console.log("JWT issued:", res.data);
      //   } catch (err) {
      //     console.error("JWT error:", err);
      //   }
      // } else {
      //   // Logout হলে token clear করো
      //   try {
      //     await axios.post(
      //       `${import.meta.env.VITE_API_URL}/logout`,
      //       {},
      //       { withCredentials: true }
      //     );
      //   } catch (err) {
      //     console.error("Logout error:", err);
      //   }
      // }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    updateUserProfile,
    logIn,
    logOut,
  };

    return (
        <AuthContext value={authInfo}>
            {!loading && children}
        </AuthContext>
    );
};

export default AuthProvider;
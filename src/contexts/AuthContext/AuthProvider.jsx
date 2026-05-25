import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth } from "../../Firebase/firebase.config";
import { useEffect, useState } from "react";
import axios from "axios";
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
    // Token remove করো
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  // Observer — user state change হলে JWT নাও
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // ✅ JWT Token নাও
        try {
          const res = await axios.post(
            "http://localhost:5000/jwt",
            { email: currentUser.email },
          );
          // Token localStorage এ save করো
          localStorage.setItem("access-token", res.data.token);
        } catch (err) {
          console.error("JWT error:", err);
        }
      } else {
        // Logout হলে token remove করো
        localStorage.removeItem("access-token");
      }

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
         
        <AuthContext.Provider value={authInfo}>
          {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
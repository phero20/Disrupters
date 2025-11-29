import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user/token from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // ===============================
  // ⭐ SIGNUP FUNCTION
  // ===============================
  const signup = async (fullname, email, password) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        fullname,
        email,
        password,
      });

      // Save to state + localStorage
      const { user } = res.data;
      setUser(user);
      setToken(user.token);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);

      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Signup failed. Try again later.",
      };
    }
  };

  // ===============================
  // ⭐ LOGIN FUNCTION
  // ===============================
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { user } = res.data;

      setToken(user.token);
      setUser(user);

      // Store in localStorage
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Try again later.",
      };
    }
  };

  // ===============================
  // ⭐ LOGOUT FUNCTION
  // ===============================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

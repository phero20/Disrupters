import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [negativeFeedbacks, setNegativeFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);

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

  // Fetch negative feedback function
  const fetchNegativeFeedbacks = async () => {
    console.log("AuthContext: Checking role...", user?.role);
    if (user?.role === 'Pharmacist') {
      console.log("AuthContext: Role is Pharmacist. Fetching feedback...");
      setFeedbackLoading(true);
      try {
        const res = await axios.get("https://disrupters-opps.vercel.app/api/feedback/negative");
        console.log("AuthContext: Fetch response:", res.data);
        if (res.data.success) {
          setNegativeFeedbacks(res.data.data);
          console.log("Negative Feedbacks set:", res.data.data);
        }
      } catch (error) {
        console.error("Error fetching negative feedback:", error);
      } finally {
        setFeedbackLoading(false);
      }
    } else {
      console.log("AuthContext: Role is NOT Pharmacist or user is null.");
      setNegativeFeedbacks([]); // Clear if not pharmacist or logged out
    }
  };

  // Fetch patients function
  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://disrupters-opps.vercel.app/api/auth/patients");
      if (res.data.success) {
        return res.data.data;
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
  };

  // Train model function
  const trainModel = async () => {
    setTrainingLoading(true);
    try {
      const res = await axios.post("https://29f1d8fe3c72.ngrok-free.app/train");
      console.log("Training response:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error training model:", error);
      return { success: false, error: error.message };
    } finally {
      setTrainingLoading(false);
    }
  };

  // Create version function
  const createVersion = async () => {
    try {
      const res = await axios.post("https://disrupters-opps.vercel.app/api/versions");
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating version:", error);
      return { success: false, error: error.message };
    }
  };

  // Fetch versions function
  const fetchVersions = async () => {
    try {
      const res = await axios.get("https://disrupters-opps.vercel.app/api/versions");
      if (res.data.success) {
        setVersions(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  const fetchAllFeedbacks = async () => {
    try {
      const response = await axios.get("https://disrupters-opps.vercel.app/api/feedback");
      if (response.data.success) {
        setAllFeedbacks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching all feedbacks:", error);
    }
  };

  // Fetch on user change
  useEffect(() => {
    console.log("AuthContext: User changed:", user);
    if (user) {
      fetchNegativeFeedbacks();
      fetchVersions();
      fetchAllFeedbacks();
    }
  }, [user]);

  // ===============================
  // ⭐ SIGNUP FUNCTION
  // ===============================
  const signup = async (fullname, email, password, role) => {
    try {
      const res = await axios.post("https://disrupters-opps.vercel.app/api/auth/signup", {
        fullname,
        email,
        password,
        role,
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
      const res = await axios.post("https://disrupters-opps.vercel.app/api/auth/login", {
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

  // ===============================
  // ⭐ SAVE FEEDBACK FUNCTION
  // ===============================
  const saveFeedback = async (feedbackData) => {
    try {
      console.log("AuthContext sending feedback:", feedbackData);
      const res = await axios.post("https://disrupters-opps.vercel.app/api/feedback", feedbackData);
      console.log("Feedback saved response:", res.data);
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("Feedback save error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to save feedback.",
      };
    }
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
        saveFeedback,
        negativeFeedbacks,
        feedbackLoading,
        fetchNegativeFeedbacks,
        fetchPatients,
        trainModel,
        createVersion,
        trainingLoading,
        versions,
        fetchVersions,
        allFeedbacks,
        fetchAllFeedbacks,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

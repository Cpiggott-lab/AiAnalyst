import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage on mount to restore user session
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      // Helper to confirm if localStorage "user" is valid JSON
      const isValidJson = (str) => {
        try {
          const parsed = JSON.parse(str);
          return typeof parsed === "object" && parsed !== null;
        } catch {
          return false;
        }
      };

      // Only restore user if both token and valid user object exist
      if (
        storedUser &&
        storedToken &&
        storedUser !== "undefined" &&
        isValidJson(storedUser)
      ) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser._id) {
          setUser(parsedUser);
        } else {
          console.warn("User object missing _id — clearing auth state.");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const register = async (email, password) => {
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      // Automatically set user after successful registration
      setUser(data.data.user);
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    // Use fetch instead of axios to POST login data
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    // Basic validation on response payload
    if (!data.user || !data.user._id || !data.token) {
      throw new Error("Invalid login response");
    }

    // Store token + user locally and update context
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    // Confirm valid session from server
    await verify();
  };

  const logout = () => {
    // Clear both token and user from storage and context
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const verify = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );
      // Update context if valid user is returned
      if (res.data.id) setUser(res.data);
      else {
        console.warn("User verification failed - clearing auth state.");
        setUser(null);
      }
    } catch (err) {
      console.error(
        "Get current user error:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

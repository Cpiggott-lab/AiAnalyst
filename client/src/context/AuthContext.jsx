import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      const isValidJson = (str) => {
        try {
          const parsed = JSON.parse(str);
          return typeof parsed === "object" && parsed !== null;
        } catch {
          return false;
        }
      };

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
      setUser(data.data.user);
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  };

  const login = async ({ email, password }) => {
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

    if (!data.user || !data.user._id || !data.token) {
      throw new Error("Invalid login response");
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    await verify();
  };

  const logout = () => {
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

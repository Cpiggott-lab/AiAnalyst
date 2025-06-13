import { createContext, useContext, useEffect, useState } from "react";

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

  const login = async ({ email, password }) => {
    const res = await fetch(
      "https://server-aianalyst.up.railway.app/api/auth/login",
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
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

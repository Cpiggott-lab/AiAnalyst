import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function LoginPage() {
  // Local state for form inputs and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get login method and current user from auth context
  const { login, user } = useAuth();

  const navigate = useNavigate(); // Used to redirect after login

  // Form submit handler
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError(""); // Clear previous error message

    try {
      // Attempt login with credentials
      await login({ email, password });
    } catch (err) {
      console.error("Login failed:", err.message);
      setError("Invalid email or password."); // Show user-friendly error
    }
  };

  // If already logged in, redirect to home
  const id = user?._id;
  useEffect(() => {
    if (user && user._id) navigate("/");
  }, [id]);

  return (
    <div className="bg-white max-w-md mx-auto mt-16 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;

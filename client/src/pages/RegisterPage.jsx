import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Access authentication context

export default function RegisterPage() {
  // Local state to hold form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Used to navigate programmatically
  const { register, user } = useAuth(); // Get the register function and current user from context

  // Handles form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      await register(email, password); // Attempt to register using the context
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed."); // Notify user of failure
    }
  };

  // Check if user is already registered/logged in
  const id = user?._id;
  useEffect(() => {
    if (user && user._id) navigate("/"); // Redirect to homepage if logged in
  }, [id]);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login here
        </Link>
      </p>
    </div>
  );
}

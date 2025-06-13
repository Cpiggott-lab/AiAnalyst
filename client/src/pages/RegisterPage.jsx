import { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(email, password);
      const loginResponse = await authService.login(email, password);

      // Redirect the user after successful login
      if (loginResponse.token) {
        navigate("/welcome");
      } else {
        alert("Login failed after registration.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed.");
    }
  };
  //once registered need to keep the user logged in under the new account created just like in the login page

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

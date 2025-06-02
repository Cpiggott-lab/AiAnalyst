import { Link } from "react-router-dom";

export default function LandingPage() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to PersonaForge</h1>
      <p className="text-lg text-gray-600 mb-8">
        A smarter way to explore and analyze your data.
      </p>

      {isLoggedIn ? (
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-blue-500 text-blue-500 px-6 py-3 rounded hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

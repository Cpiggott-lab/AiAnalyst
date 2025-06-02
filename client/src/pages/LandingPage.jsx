import { Link } from "react-router-dom";

export default function LandingPage() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold">Welcome to PersonaForge</h1>

      {isLoggedIn ? (
        <p className="mt-4">
          <Link to="/dashboard" className="text-blue-600 underline">
            Go to Dashboard
          </Link>
        </p>
      ) : (
        <p className="mt-4 text-gray-600">
          Please{" "}
          <Link to="/login" className="text-blue-600 underline">
            log in
          </Link>{" "}
          or{" "}
          <Link to="/register" className="text-blue-600 underline">
            register
          </Link>
          .
        </p>
      )}
    </div>
  );
}

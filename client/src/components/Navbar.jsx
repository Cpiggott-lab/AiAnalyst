import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto ">
        <h1 className="text-2xl font-bold tracking-wide">PersonaForge</h1>
        <div className="flex flex-row space-x-4">
          <Link className="hover:text-gray-300" to="/">
            Home
          </Link>
          {/* <Link className="hover:text-gray-300" to="/register">
            Register
          </Link>
          <Link className="hover:text-gray-300" to="/login">
            Login
          </Link> */}
          <Link className="hover:text-gray-300" to="/upload">
            Upload Project
          </Link>
          <Link className="hover:text-gray-300" to="/dashboard">
            My Dashboard
          </Link>
          <Link className="hover:text-gray-300" to="/about">
            About
          </Link>
          <Link className="hover:text-gray-300" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

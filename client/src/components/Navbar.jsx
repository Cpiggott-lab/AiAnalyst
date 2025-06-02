import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/">
          <h1 className="text-2xl font-bold">PersonaForge</h1>
        </Link>

        <div className="relative group">
          <button className="hover:text-gray-300">Menu</button>
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            <Link to="/upload" className="block px-4 py-2 hover:bg-gray-100">
              Upload Project
            </Link>
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
              My Dashboard
            </Link>
            <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
              About
            </Link>
            <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

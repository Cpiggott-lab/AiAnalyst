import { Popover } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import moreIcon from "../assets/more.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-7 py-2 shadow-md">
      <div className="flex justify-between items-center max-w-8xl mx-auto w-full">
        <Link to="/">
          <h1 className="text-2xl font-bold hover:opacity-80">AiAnalyst</h1>
        </Link>

        <div className="flex items-center gap-4">
          {/* Headless UI Popover */}
          <Popover className="relative">
            <Popover.Button className="w-10 h-10 flex items-center justify-center focus:outline-none">
              <img
                src={moreIcon}
                alt="Burger menu icon"
                className="w-8 h-8 object-contain cursor-pointer hover:opacity-80"
              />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50 flex flex-col max-h-[90vh] overflow-y-auto">
              <div className="flex-1 flex flex-col">
                {user ? (
                  <>
                    <Link to="/upload" className="px-4 py-2 hover:bg-gray-100">
                      Upload Project
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-2 hover:bg-gray-100">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      Register
                    </Link>
                  </>
                )}
                <Link to="/about" className="px-4 py-2 hover:bg-gray-100">
                  About
                </Link>
                <Link to="/contact" className="px-4 py-2 hover:bg-gray-100">
                  Contact
                </Link>
              </div>

              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
                >
                  Logout
                </button>
              )}
            </Popover.Panel>
          </Popover>

          {/* Auth Shortcut Button */}
          {user ? (
            <Link
              to="/dashboard"
              className="bg-white text-black px-2 py-1 rounded hover:opacity-80 transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-white text-black px-2 py-1 rounded hover:opacity-80 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import moreIcon from "../assets/more.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="bg-black text-white px-7 py-2 shadow-md">
      <div className="flex justify-between items-center max-w-8xl mx-auto w-full ">
        <Link to="/">
          <h1 className="text-2xl font-bold hover:opacity-80 ">AiAnalyst</h1>
        </Link>

        <div className="flex items-center gap-4">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <img
                src={moreIcon}
                alt="Burger menu icon"
                className="w-8 h-8 object-contain cursor-pointer hover:opacity-80"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50 flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex-1 flex flex-col">
                  {user ? (
                    <>
                      <Link
                        to="/upload"
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Upload Project
                      </Link>
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                  <Link
                    to="/about"
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>

                {user && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="bg-white text-black px-2 py-1 rounded hover:opacity-80 transition"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link
                to="/login"
                className="bg-white text-black px-2 py-1 rounded hover:opacity-80 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-2 py-1 rounded hover:opacity-80 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

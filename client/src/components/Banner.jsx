import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Banner({ children }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          color: 0x7cf29f,
          backgroundColor: 0x0,
          points: 15.0,
          maxDistance: 21.0,
          spacing: 16.0,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="items-stretch w-full flex-col justify-center text-white relative overflow-hidden"
    >
      <div className="flex-col relative w-screen h-[70vh] mb-16 rounded-none overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
          <h1 className="text-5xl font-bold text-white drop-shadow-md">
            Welcome to your personal AiAnalyst
          </h1>
          <p className="text-2xl text-white drop-shadow-sm">
            A smarter way to explore and analyze your data.
          </p>

          {user ? (
            <p className="text-lg text-white">
              Just{" "}
              <Link
                to="/upload"
                className="text-green-500 font-semibold hover:underline"
              >
                upload
              </Link>{" "}
              your latest data to get started.
            </p>
          ) : (
            <p className="text-lg text-white">
              It’s as easy as{" "}
              <Link
                to="/register"
                className="text-green-500 font-semibold hover:underline"
              >
                registering
              </Link>{" "}
              and uploading your data.
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

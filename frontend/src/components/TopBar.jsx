import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) {
    return (
      <div className="w-full flex items-center justify-between bg-white shadow-sm px-20 py-4 rounded-2xl">
        <img src="/temp_logo.png" alt="Logo" className="h-12 w-auto" />

        <div className="flex-1 flex justify-evenly mx-4">
          <Link to="/">
            <Button type="secondary" text="Take the quiz" />
          </Link>
          <Link to="/interpret-results">
            <Button type="secondary" text="Interpreting your results" rounded="md" />
          </Link>
        </div>

        <Link to="/specialisations">
          <Button type="primary" text="Specialisations" rounded="md" />
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        <div className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between rounded-2xl">
          <img src="/temp_logo.png" alt="Logo" className="h-12 w-auto" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 text-2xl font-bold"
          >
            ☰
          </button>
        </div>

        {isOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-sm flex flex-col px-6 py-6 space-y-4 transition-transform duration-300 ease-in-out z-50">
          <div className="flex items-center justify-between">
            <img src="/temp_logo.png" alt="Logo" className="h-12 w-auto" />
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          <Link to="/">
            <Button type="secondary" text="Take the quiz" />
          </Link>
          <Link to="/interpret-results">
            <Button type="secondary" text="Interpreting your results" rounded="md" />
          </Link>
          <Link to="/specialisations">
            <Button type="primary" text="Specialisations" rounded="md" />
          </Link>

          <div
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
            </div>
          );
        }
      };

export default TopBar;
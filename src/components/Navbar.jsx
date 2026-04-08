import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // <nav className="bg-primary text-white p-4 flex gap-4">
    //   <Link to="/home">Home</Link>
    //   <Link to="/about">About</Link>
    //   <Link to="/my-profile">Moj profil</Link>
    // </nav>
    <>
      {/* TOP BAR */}
      <nav className="bg-primary text-white p-4 flex items-center relative z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="text-2xl mr-4 hover:scale-110 transition"
        >
          ☰
        </button>
        <h1 className="font-bold text-lg">NađiEkipu</h1>
        <div className="ml-auto">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
      </nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Meni</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col p-4 gap-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-all duration-200 
              ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"}`
            }
          >
            Početna
          </NavLink>

          <NavLink
            to="/chat"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-all duration-200 
              ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"}`
            }
          >
            Chat
          </NavLink>

          <NavLink
            to="/my-profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-all duration-200 
              ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"}`
            }
          >
            Moj profil
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Navbar;
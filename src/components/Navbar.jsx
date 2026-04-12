import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";

function NavbarItem({to, onClickF, name}) {
  return (
    <NavLink
      to={to}
      onClick={() => onClickF()}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg transition-all duration-200 
        ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"}`
      }
    >
      {name}
    </NavLink>
  )
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
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
          <NavbarItem to="/home" onClickF={() => setIsOpen(false)} name="Aktivnosti" />
          <NavbarItem to="/my-chats" onClickF={() => setIsOpen(false)} name="Moji cetovi" />
          <NavbarItem to="/my-profile" onClickF={() => setIsOpen(false)} name="Moj profil" />
          <NavbarItem to="/my-interests" onClickF={() => setIsOpen(false)} name="Moja interesovanja" />
          <NavbarItem to="/my-activities" onClickF={() => setIsOpen(false)} name="Kreirane aktivnosti" />
          <NavbarItem to="/all-users" onClickF={() => setIsOpen(false)} name="Svi korisnici" />
          <NavbarItem to="/requests" onClickF={() => setIsOpen(false)} name="Zahtevi za moderaciju" />
        </div>
      </div>
    </>
  );
}

export default Navbar;

// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import Logo from "../assets/logo.png";

// function NavbarItem({to, onClickF, name}) {
//   return (
//     <NavLink
//       to={to}
//       onClick={() => onClickF()}
//       className={({ isActive }) =>
//         `px-3 py-2 rounded-lg transition-all duration-200 
//         ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"}`
//       }
//     >
//       {name}
//     </NavLink>
//   )
// }

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* TOP BAR */}
//       <nav className="bg-primary text-white p-4 flex items-center relative z-50">
//         <button
//           onClick={() => setIsOpen(true)}
//           className="text-2xl mr-4 hover:scale-110 transition"
//         >
//           ☰
//         </button>
//         <h1 className="font-bold text-lg">NađiEkipu</h1>
//         <div className="ml-auto">
//           <i className="fa-solid fa-arrow-right-from-bracket"></i>
//         </div>
//       </nav>

//       {/* OVERLAY */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* SIDEBAR */}
//       <div
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="font-bold text-gray-800">Meni</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="hover:text-red-500"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="flex flex-col p-4 gap-2">
//           <NavbarItem to="/home" onClickF={() => setIsOpen(false)} name="Aktivnosti" />
//           <NavbarItem to="/my-chats" onClickF={() => setIsOpen(false)} name="Moji cetovi" />
//           <NavbarItem to="/my-profile" onClickF={() => setIsOpen(false)} name="Moj profil" />
//           <NavbarItem to="/my-interests" onClickF={() => setIsOpen(false)} name="Moja interesovanja" />
//           <NavbarItem to="/my-activities" onClickF={() => setIsOpen(false)} name="Kreirane aktivnosti" />
//           <NavbarItem to="/all-users" onClickF={() => setIsOpen(false)} name="Svi korisnici" />
//           <NavbarItem to="/requests" onClickF={() => setIsOpen(false)} name="Zahtevi za moderaciju" />
//         </div>
//       </div>
//     </>
//   );
// }

// export default Navbar;



import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ACCENT = "#534AB7";
const ACCENT_DARK = "#3F3A8C";

function NavbarItem({ to, onClickF, name, icon }) {
  return (
    <NavLink
      to={to}
      onClick={() => onClickF()}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm
        ${isActive 
          ? "bg-linear-to-r from-primary to-primary-dark text-white shadow-md" 
          : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"}`
      }
      style={({ isActive }) => isActive ? { background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` } : {}}
    >
      <i className={`${icon} text-sm`}></i>
      <span className="font-medium">{name}</span>
    </NavLink>
  )
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Da li želite da se odjavite?")) {
      console.log("Odjavljen korisnik");
      navigate("/login");
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <nav 
        className="text-white px-4 py-3 flex items-center relative z-50 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="text-xl mr-3 hover:scale-110 transition-transform duration-200 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
        >
          ☰
        </button>
        
        <div className="flex items-center gap-2 flex-1">
          <h1 className="font-bold text-lg tracking-tight">NađiEkipu</h1>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105 text-sm"
          title="Odjavi se"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
          <span className="hidden sm:inline text-sm">Odjava</span>
        </button>
      </nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div 
          className="p-4 border-b"
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white">NađiEkipu</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 hover:rotate-90 flex items-center justify-center text-white text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-white/80 text-xs">Pronađi svoju ekipu!</p>
        </div>

        {/* User Info */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              KK
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Kralj Karaburme</p>
              <p className="text-xs text-gray-400">@kraljkaraburme</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col p-3 gap-1.5 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .flex-1::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <NavbarItem to="/home" onClickF={() => setIsOpen(false)} name="Aktivnosti" icon="fa-solid fa-calendar-day" />
          <NavbarItem to="/my-chats" onClickF={() => setIsOpen(false)} name="Moji četovi" icon="fa-solid fa-comments" />
          <NavbarItem to="/my-profile" onClickF={() => setIsOpen(false)} name="Moj profil" icon="fa-solid fa-user" />
          <NavbarItem to="/my-interests" onClickF={() => setIsOpen(false)} name="Moja interesovanja" icon="fa-solid fa-heart" />
          <NavbarItem to="/my-activities" onClickF={() => setIsOpen(false)} name="Kreirane aktivnosti" icon="fa-solid fa-calendar-plus" />
          <NavbarItem to="/all-users" onClickF={() => setIsOpen(false)} name="Svi korisnici" icon="fa-solid fa-users" />
          <NavbarItem to="/requests" onClickF={() => setIsOpen(false)} name="Zahtevi za moderaciju" icon="fa-solid fa-envelope" />
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-left gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 text-sm font-medium"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
            <span>Odjavi se</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
import React, { useState } from "react";
import Avatar from "../assets/avatar1.png";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import MojeInteresovanjeKartica from "../components/MojeInteresovanjeKartica";

const ACCENT = "#534AB7";
const ACCENT_LIGHT = "#EEEDFE";
const ACCENT_DARK = "#3F3A8C";

const user = {
  fullName: "Kralj Karaburme",
  email: "kraljkaraburme@gmail.com",
  username: "kraljkaraburme",
  birthYear: 2004,
  gender: "muški",
};

// Inicijalna interesovanja sa svim potrebnim podacima
const initialInterests = [
  { id: 1, name: "Košarka", icon: "🏀", skill: 4, count: 7 },
  { id: 2, name: "Fudbal", icon: "⚽", skill: 3, count: 2 },
  { id: 3, name: "Kuvanje", icon: "🍳", skill: 10, count: 10 },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  
  const [interests, setInterests] = useState(initialInterests);

  // Funkcija za uklanjanje interesovanja
  const handleRemove = (id) => {
    if (window.confirm("Da li želite da uklonite ovo interesovanje?")) {
      setInterests((prev) => prev.filter((hobby) => hobby.id !== id));
      console.log(`Uklonjeno interesovanje sa ID: ${id}`);
    }
  };

  // Funkcija za čuvanje izmena (skill levela)
  const handleSave = (id, newSkill) => {
    setInterests((prev) =>
      prev.map((hobby) =>
        hobby.id === id ? { ...hobby, skill: newSkill } : hobby
      )
    );
    console.log(`Sačuvan skill ${newSkill} za interesovanje ID: ${id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f3" }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div 
            className="h-32 bg-linear-to-r"
            style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}
          ></div>
          
          <div className="px-8 pb-8">
            {/* Profile Image - Overlapping */}
            <div className="flex justify-center md:justify-start -mt-16 mb-6">
              <div className="relative">
                <img
                  src={Avatar}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-lg"
                />
                <button 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
                  style={{ color: ACCENT }}
                >
                  <i className="fa-solid fa-camera text-sm"></i>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: ACCENT_DARK }}>
                  {user.fullName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
              </div>
              
              <Button text="Promeni lozinku" />
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-envelope" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-calendar" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Godište</p>
                  <p className="text-sm font-medium text-gray-700">{user.birthYear}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-venus-mars" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pol</p>
                  <p className="text-sm font-medium text-gray-700">
                    {user.gender === "muški" ? "👨 Muški" : user.gender === "ženski" ? "👩 Ženski" : user.gender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: ACCENT_DARK }}>
                🎯 Moja interesovanja
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {interests.length} {interests.length === 1 ? "interesovanje" : "interesovanja"}
              </p>
            </div>
            
            <button 
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: ACCENT_LIGHT, color: ACCENT }}
              onClick={() => navigate("/my-interests")}
            >
              <i className="fa-solid fa-plus"></i>
              <span className="text-sm font-medium">Dodaj interesovanje</span>
            </button>
          </div>

          {interests.length === 0 ? (
            <div className="bg-white rounded-2xl text-center py-12 px-6 shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-heart text-3xl text-gray-300"></i>
              </div>
              <p className="text-gray-500 font-medium">Nema dodatih interesovanja</p>
              <p className="text-sm text-gray-400 mt-1">
                Dodajte interesovanja da biste ih prikazali ovde
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interests.map((hobby, index) => (
                <div
                  key={hobby.id}
                  style={{ animationDelay: `${index * 100}ms`, animation: "fadeInUp 0.4s ease-out" }}
                >
                  <MojeInteresovanjeKartica
                    item={{
                      id: hobby.id,
                      name: hobby.name,
                      icon: hobby.icon,  
                      skill: hobby.skill,
                      count: hobby.count
                    }}
                    onRemove={handleRemove}
                    onSave={handleSave}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
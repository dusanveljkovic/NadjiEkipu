// Autor Jana Jolovic 0338/2023


import React, { useState, useEffect } from "react";
import Avatar from "../assets/avatar1.png";
import { useNavigate } from "react-router-dom";
import InterestCard from "../components/InterestCard";
import { getUserData } from "../services/api";
import { getUserById, createModeratorRequest } from "../services/usersService"
import { getUserInterests, updateUserInterest, deleteUserInterest } from "../services/interestService";


const ACCENT = "#534AB7";
const ACCENT_LIGHT = "#EEEDFE";
const ACCENT_DARK = "#3F3A8C";
const ROLES = ['', 'Admin', 'Moderator', 'Korisnik']

export default function ProfilePage() {
  const navigate = useNavigate();

  const [interests, setInterests] = useState([]);

  const user = getUserData()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const data = await getUserInterests()
    setInterests(data)
  }

  const handleSaveSkill = async (interestId, skill) => {
    await updateUserInterest(interestId, skill);
    loadData();
  };

  const handleRemoveInterest = async (interestId) => {
    await deleteUserInterest(interestId);
    loadData();
  };

  const handleModeratorRequest = async () => {
    try {
      const response = await createModeratorRequest();
      alert(response.message);
    } catch (err) {
      alert(err.message || "Greška prilikom slanja zahteva.");
    }
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
                  {user.firstname + ' ' + user.lastname}
                </h1>
                <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
              </div>

              <div className="flex gap-3 md:justify-end">

                <button
                  onClick={() => {/* promena lozinke */ }}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#534AB7",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    color: "white",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4338A4";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#534AB7";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Promeni lozinku
                </button>

                {user.role_id == 3 && (
                  <button
                    onClick={handleModeratorRequest}
                    style={{
                      padding: "9px 20px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#534AB7",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: "inherit",
                      color: "white",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4338A4";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#534AB7";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Zahtev za moderatora
                  </button>
                )}
              </div>
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
                  <p className="text-sm font-medium text-gray-700">{user.birthyear}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Uloga</p>
                  <p className="text-sm font-medium text-gray-700">{ROLES[user.role_id]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: ACCENT_LIGHT, color: ACCENT }}
              onClick={() => navigate("/my-interests")}
            >
              <i className="fa-solid fa-plus"></i>
              <span className="text-sm font-medium">Moja interesovanja</span>
            </button>
          </div>

          {interests.length === 0 ? (
            <div className="bg-white rounded-2xl text-center py-12 px-6 shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-heart text-3xl text-gray-300"></i>
              </div>
              <p className="text-gray-500 font-medium">Nema dodatih interesovanja</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interests.map((hobby, index) => (
                <div
                  key={hobby.idinterests}
                  style={{ animationDelay: `${index * 100}ms`, animation: "fadeInUp 0.4s ease-out" }}
                >
                  <InterestCard
                    interest={hobby}
                    selected={true}
                    skill={hobby.skill_level}
                    onSave={handleSaveSkill}
                    onRemove={handleRemoveInterest}
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

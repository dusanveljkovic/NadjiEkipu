// Napisala Jana Jolovic 0338/2023

import { useState, useEffect } from "react";
import Avatar from "../assets/avatar1.png";
import { useNavigate, useParams } from "react-router-dom";
import InterestCard from "../components/InterestCard";
import { getUserById } from "../services/usersService"
import { getUserInterests } from "../services/interestService";

const ACCENT = "#534AB7";
const ACCENT_LIGHT = "#EEEDFE";
const ACCENT_DARK = "#3F3A8C";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState({});
  const [interests, setInterests] = useState([]);

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    let data = await getUserById(userId)
    setUser(data)
    data = await getUserInterests()
    setInterests(data)
  }

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f3" }}>
      <div className="max-w-6xl mx-auto p-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium transition hover:opacity-70"
          style={{ color: ACCENT }}
        >
          <i className="fa-solid fa-chevron-left"></i>
          Nazad
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div
            className="h-32"
            style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}
          ></div>

          <div className="px-8 pb-8">
            {/* Profile Image */}
            <div className="flex justify-center md:justify-start -mt-16 mb-6">
              <div className="relative">
                <img
                  src={Avatar}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-lg"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: ACCENT_DARK }}>
                  {user.firstname} {user.lastname}
                </h1>
                <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-envelope" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-calendar" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Godište</p>
                  <p className="text-sm font-medium text-gray-700">{user.birthyear ?? "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ACCENT_LIGHT }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: ACCENT }}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Uloga</p>
                  <p className="text-sm font-medium text-gray-700">{user.role_name}</p>
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
                🎯 Interesovanja
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {interests.length} {interests.length === 1 ? "interesovanje" : "interesovanja"}
              </p>
            </div>
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
                  <MojeInteresovanjeKartica
                    item={{
                      id: hobby.idinterests,
                      name: hobby.name,
                      icon: hobby.icon,
                      skill: hobby.skill_level,
                      count: hobby.attended_count,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

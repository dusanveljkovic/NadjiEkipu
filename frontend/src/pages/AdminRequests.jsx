import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";

const ACCENT = "#534AB7";
const ACCENT_LIGHT = "#EEEDFE";
const ACCENT_DARK = "#3F3A8C";
const SUCCESS = "#10b981";
const SUCCESS_LIGHT = "#d1fae5";
const DANGER = "#ef4444";
const DANGER_LIGHT = "#fee2e2";

function AdminRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState(users.slice(0, 4));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const handleAccept = (id) => {
    if (window.confirm("Da li želite da prihvatite zahtev za moderatora?")) {
      setRequests(requests.filter((r) => r.id !== id));
      console.log("Prihvaćen:", id);
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Da li želite da odbijete zahtev za moderatora?")) {
      setRequests(requests.filter((r) => r.id !== id));
      console.log("Odbijen:", id);
    }
  };

  // Filter requests based on search
  const filteredRequests = requests.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: ACCENT_DARK }}>
              👋 Zahtevi za moderatora
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ukupno {requests.length} zahteva • {filteredRequests.length} prikazano
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Pretraži zahteve..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-accent transition-all"
              style={{ width: 250 }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <p className="text-xs text-purple-600 mb-1">Ukupno zahteva</p>
            <p className="text-2xl font-bold text-purple-700">{requests.length}</p>
          </div>
          <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
            <p className="text-xs text-yellow-600 mb-1">Na čekanju</p>
            <p className="text-2xl font-bold text-yellow-700">{requests.length}</p>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs text-green-600 mb-1">Prihvaćeno (ovaj mesec)</p>
            <p className="text-2xl font-bold text-green-700">12</p>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 mb-1">Stopa prihvatanja</p>
            <p className="text-2xl font-bold text-blue-700">75%</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-info-circle text-amber-500 text-xl"></i>
            <div>
              <p className="text-sm font-semibold text-amber-800">Moderatorski zahtevi</p>
              <p className="text-xs text-amber-600">
                Ovi korisnici su poslali zahtev da postanu moderatori. Pregledajte njihove profile pre nego što donesete odluku.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 mb-3 px-4 py-3 rounded-xl" style={{ background: ACCENT_LIGHT }}>
        <span className="col-span-4 text-sm font-semibold" style={{ color: ACCENT }}>
          <i className="fa-solid fa-user mr-2"></i>Ime i prezime
        </span>
        <span className="col-span-3 text-sm font-semibold" style={{ color: ACCENT }}>
          <i className="fa-solid fa-at mr-2"></i>Username
        </span>
        <span className="col-span-3 text-sm font-semibold" style={{ color: ACCENT }}>
          <i className="fa-solid fa-envelope mr-2"></i>Email
        </span>
        <span className="col-span-1 text-sm font-semibold" style={{ color: ACCENT }}>
          <i className="fa-solid fa-calendar mr-2"></i>Godište
        </span>
        <span className="col-span-1 text-sm font-semibold text-right" style={{ color: ACCENT }}>
          Akcije
        </span>
      </div>

      {/* Requests List */}
      <div className="space-y-2">
        {paginatedRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fa-solid fa-inbox text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">Nema zahteva za moderatora</p>
            <p className="text-sm text-gray-400 mt-1">Kada korisnici pošalju zahtev, oni će se pojaviti ovde</p>
          </div>
        ) : (
          paginatedRequests.map((user, index) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-4 items-center bg-white border border-gray-100 rounded-xl p-4 
                         transition-all duration-300 hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5
                         group"
              style={{ animationDelay: `${index * 50}ms`, animation: "fadeInUp 0.4s ease-out" }}
            >
              <span 
                onClick={() => navigate("/my-profile")}
                className="col-span-4 font-semibold hover:text-accent transition cursor-pointer flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.fullName.charAt(0)}{user.fullName.split(" ")[1]?.charAt(0) || ""}
                </div>
                {user.fullName}
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                  Zahtev
                </span>
              </span>

              <span className="col-span-3 text-gray-600 text-sm">@{user.username}</span>
              <span className="col-span-3 text-gray-600 text-sm truncate">{user.email}</span>
              <span className="col-span-1 text-gray-600 text-sm">{user.birthYear}</span>

              {/* Actions */}
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => handleAccept(user.id)}
                  className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200 hover:scale-110"
                  title="Prihvati zahtev"
                >
                  <i className="fa-solid fa-check text-sm"></i>
                </button>

                <button
                  onClick={() => handleReject(user.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110"
                  title="Odbij zahtev"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                       hover:border-accent/30 hover:text-accent"
          >
            <i className="fa-solid fa-chevron-left mr-1"></i> Prethodna
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200
                    ${currentPage === pageNum 
                      ? "text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-100 hover:border-accent/30"
                    }`}
                  style={currentPage === pageNum ? { background: ACCENT } : {}}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                       hover:border-accent/30 hover:text-accent"
          >
            Sledeća <i className="fa-solid fa-chevron-right ml-1"></i>
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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

export default AdminRequests;
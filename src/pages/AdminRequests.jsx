import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";


function AdminRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState(users.slice(0,4));

  const handleAccept = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
    console.log("Prihvaćen:", id);
  };

  const handleReject = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
    console.log("Odbijen:", id);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-accent">Zahtevi za moderatora</h1>

      {/* Header */}
      <div className="flex gap-x-4 text-md font-semibold">
        <span className="flex-4">Ime i prezime</span>
        <span className="flex-3">Username</span>
        <span className="flex-3">Email</span>
        <span className="flex-2">Godiste</span>
        <span className="flex-2 pr-4 text-right">Akcije</span>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {requests.map((user) => (
         <div
            key={user.id}
            className="flex items-center border rounded-xl p-4 gap-x-4 
                        transition-all duration-300 
                        hover:bg-secondary/20 
                        hover:shadow-md 
                        hover:-translate-y-1 
                        cursor-pointer"
            >
            <span 
                onClick={() => navigate("/my-profile")}
                className="flex-4 font-semibold hover:text-primary cursor-pointer transition"
            >
              {user.fullName}
            </span>

            <span className="flex-3">{user.username}</span>
            <span className="flex-4">{user.email}</span>
            <span className="flex-2">{user.birthYear}</span>

            {/* Akcije */}
            <div className="flex-2 flex justify-end gap-3 text-lg">
              <button
                onClick={() => handleAccept(user.id)}
                className="text-green-500 hover:scale-110 transition"
                title="Prihvati"
              >
                <i className="fa-solid fa-check"></i>
              </button>

              <button
                onClick={() => handleReject(user.id)}
                className="text-red-500 hover:scale-110 transition"
                title="Odbij"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button className="px-3 py-1 border rounded"><i className="fa-solid fa-chevron-left"></i></button>
        <span className="px-3 py-1">1 / 5</span>
        <button className="px-3 py-1 border rounded"><i className="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
  );
}

export default AdminRequests;
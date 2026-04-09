import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";


function AdminAllUsers() {
  const navigate = useNavigate();

  const [all_users, setAllUsers] = useState(users);

  const handleDelete = (id) => {
    setRequests(all_users.filter((r) => r.id !== id));
    console.log("Odrisan korisnik:", id);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-accent">Svi korisnici</h1>

      {/* Header */}
      <div className="flex gap-x-4 text-md font-semibold">
        <span className="flex-4">Ime i prezime</span>
        <span className="flex-3">Username</span>
        <span className="flex-3">Email</span>
        <span className="flex-2">Godiste</span>
        <span className="flex-2 pr-4 text-right">Obrisi</span>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {all_users.map((user) => (
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
                onClick={() => handleDelete(user.id)}
                className="text-gray hover:scale-110 transition"
                title="Obrisi"
              >
                <i className="fa-solid fa-trash"></i>
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

export default AdminAllUsers;
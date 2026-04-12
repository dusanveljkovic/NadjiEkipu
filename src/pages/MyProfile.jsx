
import React, { useState } from "react";
import Avatar from "../assets/avatar1.png";
import Button from "../components/Button";
import MojeInteresovanjeKartica from "../components/MojeInteresovanjeKartica";

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
  const [interests, setInterests] = useState(initialInterests);

  // Funkcija za uklanjanje interesovanja
  const handleRemove = (id) => {
    setInterests((prev) => prev.filter((hobby) => hobby.id !== id));
    console.log(`Uklonjeno interesovanje sa ID: ${id}`);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={Avatar}
              alt="Profile"
              className="w-64 h-64 object-cover rounded-2xl"
            />
          </div>

          {/* User Info */}
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>

            <p>
              <span className="font-semibold">Email: </span>
              {user.email}
            </p>

            <p>
              <span className="font-semibold">Username: </span>
              {user.username}
            </p>

            <div className="flex justify-center md:justify-start gap-6">
              <p>
                <span className="font-semibold">Godište: </span>
                {user.birthYear}
              </p>

              <p>
                <span className="font-semibold">Pol: </span>
                {user.gender}
              </p>
            </div>

            <Button text="Promeni lozinku" />
          </div>
        </div>

        {/* Interests */}
        <div className="mt-12">
          <h1 className="text-2xl font-semibold mb-6 text-primary text-center md:text-left">
            Moja interesovanja
          </h1>

          {interests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nema dodatih interesovanja.</p>
              <p className="text-sm">Dodajte interesovanja na stranici za pretragu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {interests.map((hobby) => (
                <MojeInteresovanjeKartica
                  key={hobby.id}
                  item={{
                    id: hobby.id,
                    name: hobby.name,
                    icon: hobby.icon,  // OVO JE BITNO - ikona mora da postoji
                    skill: hobby.skill,
                    count: hobby.count
                  }}
                  onRemove={handleRemove}
                  onSave={handleSave}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
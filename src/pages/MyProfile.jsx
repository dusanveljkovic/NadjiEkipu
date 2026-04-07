import React from "react";
import Avatar from "../assets/avatar1.png";
import Button from "../components/Button";

const user = {
  fullName: "Kralj Karaburme",
  email: "kraljkaraburme@gmail.com",
  username: "kraljkaraburme",
  birthYear: 2004,
  gender: "muški",
};

const interests = [
  { id: 1, name: "Košarka", skill: 4, count: 7 },
  { id: 2, name: "Fudbal", skill: 3, count: 2 },
  { id: 3, name: "Kuvanje", skill: 10, count: 10 },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Profile Image */}
          <div className="flex justify-center">
            <img
                src={Avatar}
                alt="Profile"
                className="w-64 h-64 object-cover rounded-2xl "
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {interests.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-5 shadow-md border border-primary bg-linear-to-br from-white to-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-2 text-primary">
                  {item.name}
                </h3>

                <div className="mb-2">
                  <p className="text-sm text-gray-600">Skill level</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.skill * 10}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Prisustva aktivnosti: <span className="font-semibold">{item.count}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

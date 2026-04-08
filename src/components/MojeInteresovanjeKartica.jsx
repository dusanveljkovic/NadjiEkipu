import React from "react";

export default function MojeInteresovanjeKartica({ item, onEdit }) {
  return (
    <div className="relative rounded-2xl p-5 shadow-md border border-primary bg-linear-to-br from-white to-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    
      <button
        onClick={() => onEdit && onEdit(item)}
        className="absolute top-3 right-3 text-gray-500 hover:text-primary transition"
      >
        <i class="fa-solid fa-pen-to-square"></i>
      </button>

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
        Prisustvo aktivnosti:{" "}
        <span className="font-semibold">{item.count}</span>
      </p>
    </div>
  );
}
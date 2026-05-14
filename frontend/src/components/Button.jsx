import React from "react";

export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary hover:bg-secondary transition-all duration-300 text-white px-6 py-2 rounded-xl hover:scale-102"
    >
      {text}
    </button>
  );
}
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 flex gap-4">
      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/my-profile">Moj profil</Link>
    </nav>
  );
}

export default Navbar;

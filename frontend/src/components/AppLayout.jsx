//
// Napisao Ivan Majer 2023/0406
//
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
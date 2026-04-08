import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Navbar from "./components/Navbar";
import Registration from "./pages/Registration";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="/registration" element={<Registration />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;

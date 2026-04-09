import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Navbar from "./components/Navbar";
import Registration from "./pages/Registration";
import SingleChat from "./pages/SingleChat"
import MyChats from "./pages/MyChats";

function App() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {location.pathname !== "/login" && <Navbar />}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/registration" element={<Registration />}/>
          <Route path="/mock-chat" element={<SingleChat />}/>
          <Route path="/my-chats" element={<MyChats />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;


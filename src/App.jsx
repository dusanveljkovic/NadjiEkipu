import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Navbar from "./components/Navbar";
import Registration from "./pages/Registration";
import SingleChat from "./pages/SingleChat"
import MyChats from "./pages/MyChats";
import AdminRequests from "./pages/AdminRequests";
import AdminAllUsers from "./pages/AdminAllUsers";
import MyInterests from "./pages/MyInterests";
import MyActivites from "./pages/MyActivities"
import CreateActivity from "./pages/CreateActivity";
import AddInterest from "./pages/AddInterest";

function App() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {location.pathname !== "/login" && location.pathname !== "/registration" && location.pathname !== "/" && <Navbar />}
      <div className="p-4">
        <div style={{marginTop: "20px"}}></div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/registration" element={<Registration />}/>
          <Route path="/mock-chat" element={<SingleChat />}/>
          <Route path="/my-chats" element={<MyChats />}/>
          <Route path="/requests" element={<AdminRequests />}/>
          <Route path="/all-users" element={<AdminAllUsers />}/>
          <Route path="/my-interests" element={<MyInterests />}/>
          <Route path="/my-activities" element={<MyActivites />}/>
          <Route path="create-activity" element={<CreateActivity />}/>
          <Route path="/add-interest" element={<AddInterest/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;


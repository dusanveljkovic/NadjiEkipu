import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Navbar from "./components/Navbar";
import Registration from "./pages/Registration";
import SingleChat from "./pages/SingleChat"
import AdminRequests from "./pages/AdminRequests";
import AdminAllUsers from "./pages/AdminAllUsers";
import MyInterests from "./pages/MyInterests";
import MyActivites from "./pages/MyActivities"
import CreateActivity from "./pages/CreateActivity";
import AddInterest from "./pages/AddInterest";
import UserProfilePage from "./pages/UserProfilePage";
import MyChats from "./pages/MyChats"
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/AdminRoute";
import ModeratorRoute from "./components/ModeratorRoute";
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/AppLayout";
import GuestRoute from "./components/GuestRoute";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <Routes>
          {/* PUBLIC */}
          <Route element={<GuestRoute/>}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
            </Route>
          </Route>
          

          {/* PRIVATE */}
          <Route element={<UserRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/my-chats" element={<MyChats />} />
              <Route path="/my-chats/:chatId" element={<SingleChat />} />
              <Route path="/my-interests" element={<MyInterests />} />
              <Route path="/my-activities" element={<MyActivites />} />
              <Route path="/create-activity" element={<CreateActivity />} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
            </Route>
          </Route>

          {/* ADMIN */}
          <Route element={<AdminRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/requests" element={<AdminRequests />} />
              <Route path="/all-users" element={<AdminAllUsers />} />
            </Route>
          </Route>

          {/* MODERATOR */}
          <Route element={<ModeratorRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/add-interest" element={<AddInterest />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;


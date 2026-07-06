//
// Napisao Ivan Majer 2023/0406
//
import { Navigate, Outlet } from "react-router-dom";
import { getUserData, removeUserData } from "../services/api";

export default function AdminRoute() {
    const user = getUserData();

    console.log("User: ", user);
    

    if (!user) {
        console.log("NO USER");
        return <Navigate to="/login" replace />;
    }
    const role = user.role_id;

    if (role !== 1){
        console.log("INVALID ROLE");
        return <Navigate to="/home" replace />;
    }

    return <Outlet/>;
}
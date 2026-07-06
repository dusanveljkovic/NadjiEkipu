import { Navigate, Outlet } from "react-router-dom";
import { getUserData, removeUserData } from "../services/api";

export default function ModeratorRoute() {
    const user = getUserData();

    console.log("USER:", user);

    if (!user) {
        console.log("NO USER");
        return <Navigate to="/login" replace />;
    }

    const role = user.role_id;

    console.log("ROLE:", role);

    if (![1, 2].includes(role)) {
        console.log("INVALID ROLE");
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
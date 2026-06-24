import { Navigate, Outlet } from "react-router-dom";
import { getUserData, removeUserData } from "../services/api";

export default function AdminRoute() {
    const user = getUserData();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    try {
        const role = user.role_id;

        if (role !== 1){
            return <Navigate to="/home" replace />;
        }

        return <Outlet/>;
    }
    catch {
        removeUserData();
        return <Navigate to="/login" replace/>;
    }
}
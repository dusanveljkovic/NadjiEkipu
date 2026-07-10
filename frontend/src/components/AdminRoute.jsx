//
// Napisao Ivan Majer 2023/0406
//
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserData, removeUserData } from "../services/api";

export default function AdminRoute() {
    /*
    Guard koji proverava pristup ruti sa admin privilegijama
    U slucaju neuspesnog pristupa, vraca korisnika na home stranicu
     */
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserData()
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const role = user.role_id;

    if (role != 1) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
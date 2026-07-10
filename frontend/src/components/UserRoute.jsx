//
// Napisao Ivan Majer 2023/0406
//
import { useEffect, useState } from "react";
import { getUserData } from "../services/api";
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
    /*
    Guard koji proverava pristup ruti dostupnoj ulogovanom korisniku
    U slucaju neuspesnog pristupa, vraca login stranicu
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

    if (![1, 2, 3].includes(role)) {
        removeUserData();
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
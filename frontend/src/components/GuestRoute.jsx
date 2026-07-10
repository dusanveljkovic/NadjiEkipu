//
// Napisao Ivan Majer 2023/0406
//
import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../services/api";
import { useState, useEffect } from "react";
import { getUserData } from "../services/api";

export default function GuestRoute(){
    /*
    Guard koji proverava pristup ruti koja zahteva neulogovanog korisnika
    U slucaju neuspesnog pristupa, vraca korisnika na home stranicu
     */
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        getUserData()
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    if (user === undefined) {
        return null;
    }

    if (user) {
        return <Navigate to="/my-profile" replace />;
    }

    return <Outlet />;
}
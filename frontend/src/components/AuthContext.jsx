import { createContext, useState } from "react";
import { getAuthToken, getUserData, setAuthToken, setUserData } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(getAuthToken());
    const [user, setUser] = useState(getUserData());

    const login = (data) => {
        setAuthToken(data.token);
        setUserData(data.user);

        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        removeAuthToken();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);

    const loginUser = (userData, token) => {

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };

    const logoutUser = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loginUser,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
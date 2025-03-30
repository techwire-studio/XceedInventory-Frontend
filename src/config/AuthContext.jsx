import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for existing token
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        } 
    }, []);

	const login = async (username, password) => {
		try {
			const res = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			if (res.ok) {
				localStorage.setItem("token", data.token);
				setUser({ token: data.token });
			} else {
				throw new Error(data.message || "Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;

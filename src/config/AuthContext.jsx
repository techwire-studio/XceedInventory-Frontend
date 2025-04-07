import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        verifyAuthentication();
    }, []);

    const verifyAuthentication = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify", {}, {
                withCredentials: true
            })
            if(res.status === 200){
                setUser(res.data.username)
            } 
        }catch(error){
            console.error("Verification error:", error);
        }finally{
            setIsLoading(false);
        }
    }

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                username,
                password,
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            
            console.log("Response:", response.data);
            
            // Update state with user info
            setUser(response.data.username || username);
            setRole(response.data.role);
            
            return { 
                success: true, 
                message: response.data.message,
                role: response.data.role 
            };
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: error.response?.data?.error || "Login failed" 
            };
        }
    };

    const logout = async () => {
        try {
            // Call the logout endpoint to clear the cookie
            await axios.post("http://localhost:5000/api/auth/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Always clear local state
            setUser(null);
            setRole(null);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            role, 
            isLoading,
            login, 
            logout,
            verifyAuthentication 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

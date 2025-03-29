import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Header from "./components/Header";
import { AuthProvider } from "./config/AuthContext";
import ProtectedRoute from "./config/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
                <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
                <Route path="/dashboard/*" element={<ProtectedRoute component={Dashboard} />} />
            </Routes>
            <Toaster />
        </AuthProvider>
    );
}

export default App;
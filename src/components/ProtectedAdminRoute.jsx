import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {

    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("admin");

    console.log("ProtectedAdminRoute");
    console.log("Admin Token:", token);
    console.log("Admin:", admin);

    if (!token || !admin) {
        console.log("Redirecting to admin login...");
        return <Navigate to="/admin-login" replace />;
    }

    console.log("Admin authenticated");

    return children;
}
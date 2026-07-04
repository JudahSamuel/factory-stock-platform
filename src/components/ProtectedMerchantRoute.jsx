import { Navigate } from "react-router-dom";

export default function ProtectedMerchantRoute({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {

        return <Navigate to="/merchant-login" replace />;

    }

    return children;

}
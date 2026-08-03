import { Navigate } from "react-router-dom";

export default function ProtectedMerchantRoute({ children }) {

    const token = localStorage.getItem("token");
    const merchant = localStorage.getItem("merchant");

    if (!token || !merchant) {
        return <Navigate to="/merchant-login" replace />;
    }

    return children;
}
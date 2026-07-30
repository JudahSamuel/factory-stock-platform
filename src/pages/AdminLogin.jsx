import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

export default function AdminLogin() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!email || !password) {

            alert("Please enter email and password.");
            return;

        }

        try {

            setLoading(true);

            const response = await loginAdmin({

                email,
                password

            });

            localStorage.setItem(
                "adminToken",
                response.data.token
            );

            localStorage.setItem(
                "admin",
                JSON.stringify(response.data.admin)
            );

            alert("Login Successful");

            navigate("/admin-dashboard");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="relative min-h-screen bg-slate-100 flex justify-center items-center">

            {/* Home Button */}
            <div className="absolute top-6 left-6">

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
                >
                    ← Home
                </button>

            </div>

            {/* Language Toggle */}
            <div className="absolute top-6 right-6">

                <LanguageToggle />

            </div>

            {/* Login Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">

                <h1 className="text-3xl font-bold mb-6 text-center">

                    {t("adminLogin")}

                </h1>

                <input
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                />

                <input
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-6"
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Logging in..." : t("login")}
                </button>

            </div>

        </div>

    );

}
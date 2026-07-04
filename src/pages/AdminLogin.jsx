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

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex justify-center items-center relative">

            {/* Language Toggle */}

            <div className="absolute top-6 right-6">

                <LanguageToggle />

            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">

                <h1 className="text-3xl font-bold mb-6 text-center">

                    {t("adminLogin")}

                </h1>

                <input

                    type="email"

                    placeholder={t("email")}

                    value={email}

                    onChange={(e) =>

                        setEmail(e.target.value)

                    }

                    className="w-full border p-3 rounded mb-4"

                />

                <input

                    type="password"

                    placeholder={t("password")}

                    value={password}

                    onChange={(e) =>

                        setPassword(e.target.value)

                    }

                    className="w-full border p-3 rounded mb-6"

                />

                <button

                    onClick={handleLogin}

                    disabled={loading}

                    className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-lg transition"

                >

                    {

                        loading

                            ? "Logging in..."

                            : t("login")

                    }

                </button>

            </div>

        </div>

    );

}
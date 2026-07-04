import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginMerchant } from "../api/auth";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

export default function MerchantLogin() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!email || !password) {

            alert("Please enter email and password");

            return;

        }

        try {

            setLoading(true);

            const response = await loginMerchant({

                email,

                password,

            });

            localStorage.setItem(

                "token",

                response.data.token

            );

            localStorage.setItem(

                "merchant",

                JSON.stringify(response.data.merchant)

            );

            alert("Login Successful");

            navigate("/merchant-dashboard");

        }

        catch (error) {

            console.error(error);

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

                    {t("merchantLogin")}

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

                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"

                >

                    {

                        loading

                            ? "Logging in..."

                            : t("login")

                    }

                </button>

                <p className="text-center mt-5 text-gray-600">

                    {t("newMerchant")}{" "}

                    <Link

                        to="/merchant-register"

                        className="text-blue-600 font-semibold hover:underline"

                    >

                        {t("register")}

                    </Link>

                </p>

            </div>

        </div>

    );

}
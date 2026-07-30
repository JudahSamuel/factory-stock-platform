import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerMerchant } from "../services/merchantService";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

export default function MerchantRegister() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const [form, setForm] = useState({
        shopName: "",
        ownerName: "",
        gstNumber: "",
        email: "",
        phone: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await registerMerchant(form);

            alert("Registration Successful.\nWaiting for Admin Approval.");

            navigate("/merchant-login");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Registration Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="relative min-h-screen bg-gray-100 flex justify-center items-center">

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

            {/* Registration Card */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-[450px]"
            >

                <h1 className="text-3xl font-bold mb-8 text-center">

                    {t("register")} {t("merchantPortal")}

                </h1>

                <input
                    name="shopName"
                    placeholder={t("shopName")}
                    className="border p-3 rounded w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="ownerName"
                    placeholder={t("ownerName")}
                    className="border p-3 rounded w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="gstNumber"
                    placeholder={t("gstNumber")}
                    className="border p-3 rounded w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    className="border p-3 rounded w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="phone"
                    placeholder={t("phone")}
                    className="border p-3 rounded w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder={t("password")}
                    className="border p-3 rounded w-full mb-6"
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Registering..." : t("register")}
                </button>

                <p className="text-center mt-6 text-sm text-gray-600">

                    Already have an account?{" "}

                    <Link
                        to="/merchant-login"
                        className="font-semibold text-green-600 hover:text-green-700 hover:underline transition"
                    >
                        Go to Login
                    </Link>

                </p>

            </form>

        </div>

    );

}
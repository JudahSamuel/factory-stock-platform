import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    LayoutDashboard,
    Package,
    ClipboardList,
    BarChart3,
    CreditCard,
    Users,
    LogOut
} from "lucide-react";

export default function AdminSidebar() {

    const navigate = useNavigate();

    const location = useLocation();

    const { t } = useTranslation();

    const admin = JSON.parse(

        localStorage.getItem("admin") || "{}"

    );

    const menu = [

        {
            name: t("dashboard"),
            icon: LayoutDashboard,
            path: "/admin-dashboard",
        },

        {
            name: t("inventory"),
            icon: Package,
            path: "/factory-dashboard",
        },

        {
            name: t("orders"),
            icon: ClipboardList,
            path: "/admin-orders",
        },

        {
            name: t("merchantApprovals"),
            icon: Users,
            path: "/merchant-approvals",
        },

        {
            name: t("analytics"),
            icon: BarChart3,
            path: "/analytics",
        },

        {
            name: t("creditNotes"),
            icon: CreditCard,
            path: "/credit-notes",
        },

    ];

    const logout = () => {

        localStorage.removeItem("admin");

        localStorage.removeItem("adminToken");

        navigate("/admin-login");

    };

    return (

        <div className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

            {/* Logo */}

            <div className="p-6 border-b border-slate-700">

                <h1 className="text-3xl font-bold">

                    LASYA ERP

                </h1>

                <p className="text-slate-400 text-sm mt-1">

                    Enterprise Suite

                </p>

            </div>

            {/* Logged in User */}

            <div className="px-6 py-5 border-b border-slate-700">

                <p className="text-sm text-slate-400">

                    Logged in as

                </p>

                <h2 className="font-semibold text-lg">

                    {admin.name || "Admin"}

                </h2>

            </div>

            {/* Menu */}

            <div className="flex-1 p-4 space-y-2">

                {menu.map((item) => {

                    const Icon = item.icon;

                    const active =

                        location.pathname === item.path;

                    return (

                        <button

                            key={item.path}

                            onClick={() =>

                                navigate(item.path)

                            }

                            className={`

                                w-full

                                flex

                                items-center

                                gap-4

                                p-4

                                rounded-xl

                                transition

                                duration-300

                                ${active

                                    ? "bg-yellow-400 text-black font-semibold"

                                    : "hover:bg-slate-800"}

                            `}

                        >

                            <Icon size={22} />

                            <span>

                                {item.name}

                            </span>

                        </button>

                    );

                })}

            </div>

            {/* Logout */}

            <div className="p-4 border-t border-slate-700">

                <button

                    onClick={logout}

                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-600 transition"

                >

                    <LogOut size={22} />

                    <span>

                        {t("logout")}

                    </span>

                </button>

            </div>

        </div>

    );

}
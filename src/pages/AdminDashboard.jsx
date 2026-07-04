import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import { getAnalytics } from "../api/analytics";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const [analytics, setAnalytics] = useState({

        totalProducts: 0,
        totalMerchants: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        revenue: 0,
        inventoryValue: 0

    });

    useEffect(() => {

        loadAnalytics();

    }, []);

    const loadAnalytics = async () => {

        try {

            const res = await getAnalytics();

            setAnalytics(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const cards = [

        {
            title: `📦 ${t("inventory")}`,
            description: t("inventoryDesc"),
            path: "/factory-dashboard",
        },

        {
            title: `📋 ${t("orders")}`,
            description: t("ordersDesc"),
            path: "/admin-orders",
        },

        {
            title: `👥 ${t("merchantApprovals")}`,
            description: t("merchantApprovalDesc"),
            path: "/merchant-approvals",
        },

        {
            title: `📊 ${t("analytics")}`,
            description: t("analyticsDesc"),
            path: "/analytics",
        },

        {
            title: `💳 ${t("creditNotes")}`,
            description: t("creditNotesDesc"),
            path: "/credit-notes",
        },

    ];

    return (

        <AdminLayout>

            {/* Hero */}

            <motion.div

                initial={{ opacity: 0, y: -30 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.5 }}

                className="
                bg-white/80
                backdrop-blur-lg
                rounded-2xl
                shadow-lg
                p-8
                mb-8
                border
                border-white/30"

            >

                <h1 className="text-4xl font-bold mb-2">

                    {t("welcomeAdmin")}

                </h1>

                <p className="text-gray-600">

                    {t("dashboardSubtitle")}

                </p>

            </motion.div>

            {/* Statistics */}

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

                <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">

                    <h3 className="text-sm opacity-80">

                        {t("totalProducts")}

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {analytics.totalProducts}

                    </p>

                </div>

                <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">

                    <h3 className="text-sm opacity-80">

                        {t("totalMerchants")}

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {analytics.totalMerchants}

                    </p>

                </div>

                <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg">

                    <h3 className="text-sm opacity-80">

                        {t("totalOrders")}

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {analytics.totalOrders}

                    </p>

                </div>

                <div className="bg-red-600 text-white rounded-2xl p-6 shadow-lg">

                    <h3 className="text-sm opacity-80">

                        {t("revenue")}

                    </h3>

                    <p className="text-3xl font-bold mt-2">

                        ₹{Number(analytics.revenue).toLocaleString()}

                    </p>

                </div>

            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-10">

                <div className="bg-white rounded-2xl shadow p-6">

                    <h3 className="text-gray-500">

                        {t("pendingOrders")}

                    </h3>

                    <p className="text-4xl font-bold text-yellow-600 mt-3">

                        {analytics.pendingOrders}

                    </p>

                </div>

                <div className="bg-white rounded-2xl shadow p-6">

                    <h3 className="text-gray-500">

                        {t("deliveredOrders")}

                    </h3>

                    <p className="text-4xl font-bold text-green-600 mt-3">

                        {analytics.deliveredOrders}

                    </p>

                </div>

                <div className="bg-white rounded-2xl shadow p-6">

                    <h3 className="text-gray-500">

                        {t("inventoryValue")}

                    </h3>

                    <p className="text-3xl font-bold text-blue-600 mt-3">

                        ₹{Number(analytics.inventoryValue).toLocaleString()}

                    </p>

                </div>

            </div>

            {/* Navigation Cards */}

            <div className="grid md:grid-cols-2 gap-8">

                {cards.map((card, index) => (

                    <motion.div

                        key={card.title}

                        initial={{ opacity: 0, y: 40 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{

                            delay: index * 0.1,

                            duration: 0.4

                        }}

                        whileHover={{ scale: 1.03 }}

                        onClick={() => navigate(card.path)}

                        className="
                        cursor-pointer
                        bg-white/80
                        backdrop-blur-lg
                        rounded-2xl
                        shadow-lg
                        p-8
                        border
                        border-white/30
                        hover:shadow-2xl
                        transition"

                    >

                        <h2 className="text-2xl font-bold mb-4">

                            {card.title}

                        </h2>

                        <p className="text-gray-600">

                            {card.description}

                        </p>

                    </motion.div>

                ))}

            </div>

        </AdminLayout>

    );

}
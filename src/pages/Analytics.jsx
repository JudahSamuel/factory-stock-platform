import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAnalytics } from "../api/analytics";

import {

    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,

    BarChart,
    Bar,

    PieChart,
    Pie,
    Cell,

} from "recharts";

export default function Analytics() {

    const [data, setData] = useState(null);

    useEffect(() => {

        load();

    }, []);

    const load = async () => {

        try {

            const res = await getAnalytics();

            setData(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    if (!data) {

        return (

            <AdminLayout>

                <div className="text-2xl">

                    Loading Analytics...

                </div>

            </AdminLayout>

        );

    }

    return (

        <AdminLayout>

            <h1 className="text-4xl font-bold mb-8">

                Business Analytics

            </h1>

            {/* KPI Cards */}

            <div className="grid lg:grid-cols-4 gap-6 mb-10">

                <div className="bg-blue-600 rounded-xl p-6 text-white">

                    <h3>Total Products</h3>

                    <p className="text-4xl font-bold">

                        {data.totalProducts}

                    </p>

                </div>

                <div className="bg-green-600 rounded-xl p-6 text-white">

                    <h3>Total Merchants</h3>

                    <p className="text-4xl font-bold">

                        {data.totalMerchants}

                    </p>

                </div>

                <div className="bg-purple-600 rounded-xl p-6 text-white">

                    <h3>Total Orders</h3>

                    <p className="text-4xl font-bold">

                        {data.totalOrders}

                    </p>

                </div>

                <div className="bg-red-600 rounded-xl p-6 text-white">

                    <h3>Revenue</h3>

                    <p className="text-3xl font-bold">

                        ₹{data.revenue.toLocaleString()}

                    </p>

                </div>

            </div>

            {/* Revenue Chart */}

            <div className="bg-white rounded-xl shadow p-6 mb-10">

                <h2 className="text-2xl font-bold mb-6">

                    Monthly Revenue

                </h2>

                <ResponsiveContainer

                    width="100%"

                    height={300}

                >

                    <LineChart

                        data={data.monthlyRevenue}

                    >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line

                            type="monotone"

                            dataKey="revenue"

                            stroke="#2563eb"

                            strokeWidth={4}

                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

                        {/* Orders + Top Products */}

            <div className="grid lg:grid-cols-2 gap-8 mb-10">

                {/* Monthly Orders */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-2xl font-bold mb-6">

                        Monthly Orders

                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <BarChart
                            data={data.monthlyOrders}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="month" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="orders"
                                fill="#22c55e"
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* Top Products */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-2xl font-bold mb-6">

                        Top Selling Products

                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <BarChart
                            layout="vertical"
                            data={data.topProducts}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                            />

                            <YAxis
                                type="category"
                                dataKey="product"
                                width={150}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="quantity"
                                fill="#3b82f6"
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* Top Merchants */}

            <div className="bg-white rounded-xl shadow p-6 mb-10">

                <h2 className="text-2xl font-bold mb-6">

                    Top Merchants

                </h2>

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="text-left py-3">

                                Merchant

                            </th>

                            <th className="text-right">

                                Revenue

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            data.topMerchants.map(

                                (merchant, index) => (

                                    <tr
                                        key={index}
                                        className="border-b"
                                    >

                                        <td className="py-3">

                                            {merchant.merchant}

                                        </td>

                                        <td className="text-right font-semibold">

                                            ₹{merchant.revenue.toLocaleString()}

                                        </td>

                                    </tr>

                                )

                            )

                        }

                    </tbody>

                </table>

            </div>

                        {/* Inventory Category */}

            <div className="bg-white rounded-xl shadow p-6 mb-10">

                <h2 className="text-2xl font-bold mb-6">

                    Inventory by Category

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <PieChart>

                        <Pie

                            data={data.categoryInventory}

                            dataKey="stock"

                            nameKey="category"

                            outerRadius={120}

                            label

                        >

                            {

                                data.categoryInventory.map(

                                    (entry, index) => (

                                        <Cell

                                            key={index}

                                            fill={[

                                                "#2563eb",

                                                "#22c55e",

                                                "#f59e0b",

                                                "#ef4444",

                                                "#8b5cf6",

                                                "#06b6d4"

                                            ][index % 6]}

                                        />

                                    )

                                )

                            }

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            {/* Bottom Statistics */}

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-yellow-500 text-white rounded-xl p-6">

                    <h3 className="text-lg">

                        Pending Orders

                    </h3>

                    <p className="text-4xl font-bold mt-3">

                        {data.pendingOrders}

                    </p>

                </div>

                <div className="bg-green-600 text-white rounded-xl p-6">

                    <h3 className="text-lg">

                        Delivered Orders

                    </h3>

                    <p className="text-4xl font-bold mt-3">

                        {data.deliveredOrders}

                    </p>

                </div>

                <div className="bg-blue-700 text-white rounded-xl p-6">

                    <h3 className="text-lg">

                        Inventory Value

                    </h3>

                    <p className="text-3xl font-bold mt-3">

                        ₹{data.inventoryValue.toLocaleString()}

                    </p>

                </div>

            </div>

        </AdminLayout>

    );

}
import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AnimatedPage from "../components/AnimatedPage";
import { getMerchants } from "../api/admin";
import { useNavigate } from "react-router-dom";

export default function Merchants() {
    const navigate = useNavigate();
    const [merchants, setMerchants] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await getMerchants();
            setMerchants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = useMemo(() => {
        return merchants.filter((m) =>
            `${m.ownerName} ${m.shopName} ${m.email}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [merchants, search]);

    return (
        <AnimatedPage>
            <div className="min-h-screen flex bg-slate-100">

                <AdminSidebar />

                <div className="flex-1 p-8">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-4xl font-bold">
                                Merchants
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Total Approved Merchants : {filtered.length}
                            </p>
                        </div>

                        <input
                            type="text"
                            placeholder="Search merchant..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded-lg px-4 py-2 w-80 outline-none focus:ring-2 focus:ring-yellow-400"
                        />

                    </div>

                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-slate-900 text-white">

                                <tr>

                                    <th className="p-4 text-left">Merchant</th>
                                    <th className="text-left">Shop</th>
                                    <th className="text-left">Email</th>
                                    <th className="text-left">Phone</th>
                                    <th className="text-center">Credit</th>
                                    <th className="text-center">Orders</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filtered.map((m) => (

                                    <tr
                                        key={m.id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >

                                        <td className="p-4 font-medium">
                                            {m.ownerName}
                                        </td>

                                        <td>{m.shopName}</td>

                                        <td>{m.email}</td>

                                        <td>{m.phone}</td>

                                        <td className="text-center">

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                                ₹{m.credit}

                                            </span>

                                        </td>

                                        <td className="text-center">

                                            {m.totalOrders}

                                        </td>

                                        <td className="text-center">

    <span
        className={`px-3 py-1 rounded-full ${
            m.approved
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
        }`}
    >
        {m.approved ? "Approved" : "Pending"}
    </span>

</td>

                                        <td className="text-center space-x-2">

                                            <button

    onClick={() => navigate(`/merchant/${m.id}`)}

    className="bg-slate-900 text-white px-3 py-1 rounded hover:bg-black"

>

    Profile

</button>

                                            <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">
                                                Orders
                                            </button>

                                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                                Credit
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </AnimatedPage>
    );

}
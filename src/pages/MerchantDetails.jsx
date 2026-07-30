import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AnimatedPage from "../components/AnimatedPage";
import { getMerchantDetails } from "../api/admin";

export default function MerchantDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [merchant, setMerchant] = useState(null);

    const [tab, setTab] = useState("profile");

    useEffect(() => {

        loadMerchant();

    }, []);

    const loadMerchant = async () => {

        try {

            const res = await getMerchantDetails(id);

            setMerchant(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    if (!merchant) {

        return (

            <AnimatedPage>

                <div className="min-h-screen flex items-center justify-center">

                    Loading...

                </div>

            </AnimatedPage>

        );

    }

    return (

        <AnimatedPage>

            <div className="min-h-screen flex bg-slate-100">

                <AdminSidebar />

                <div className="flex-1 p-8">

                    <button

                        onClick={() => navigate(-1)}

                        className="mb-6 bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-black"

                    >

                        ← Back

                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">

                        <h1 className="text-4xl font-bold">

                            {merchant.shopName}

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Owner : {merchant.ownerName}

                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

                            <div>

                                <p className="text-gray-500">

                                    GST Number

                                </p>

                                <h2 className="font-semibold">

                                    {merchant.gstNumber}

                                </h2>

                            </div>

                            <div>

                                <p className="text-gray-500">

                                    Email

                                </p>

                                <h2>

                                    {merchant.email}

                                </h2>

                            </div>

                            <div>

                                <p className="text-gray-500">

                                    Phone

                                </p>

                                <h2>

                                    {merchant.phone}

                                </h2>

                            </div>

                            <div>

                                <p className="text-gray-500">

                                    Registered

                                </p>

                                <h2>

                                    {new Date(
                                        merchant.createdAt
                                    ).toLocaleDateString()}

                                </h2>

                            </div>

                        </div>

                    </div>

                    <div className="flex gap-4 mt-8">

                        <button

                            onClick={() => setTab("profile")}

                            className={`px-6 py-3 rounded-lg ${tab === "profile"
                                ? "bg-yellow-400"
                                : "bg-white"
                                }`}

                        >

                            Profile

                        </button>

                        <button

                            onClick={() => setTab("orders")}

                            className={`px-6 py-3 rounded-lg ${tab === "orders"
                                ? "bg-yellow-400"
                                : "bg-white"
                                }`}

                        >

                            Orders

                        </button>

                        <button

                            onClick={() => setTab("credit")}

                            className={`px-6 py-3 rounded-lg ${tab === "credit"
                                ? "bg-yellow-400"
                                : "bg-white"
                                }`}

                        >

                            Credit Notes

                        </button>

                    </div>

                    {tab === "profile" && (

                        <div className="bg-white rounded-xl shadow mt-6 p-8">

                            <h2 className="text-2xl font-bold mb-6">

                                Merchant Profile

                            </h2>

                            <div className="grid grid-cols-2 gap-6">

                                <div>

                                    <p className="text-gray-500">

                                        Shop Name

                                    </p>

                                    <h3>{merchant.shopName}</h3>

                                </div>

                                <div>

                                    <p className="text-gray-500">

                                        Owner

                                    </p>

                                    <h3>{merchant.ownerName}</h3>

                                </div>

                                <div>

                                    <p className="text-gray-500">

                                        Email

                                    </p>

                                    <h3>{merchant.email}</h3>

                                </div>

                                <div>

                                    <p className="text-gray-500">

                                        Phone

                                    </p>

                                    <h3>{merchant.phone}</h3>

                                </div>

                                <div>

                                    <p className="text-gray-500">

                                        GST

                                    </p>

                                    <h3>{merchant.gstNumber}</h3>

                                </div>

                            </div>

                        </div>

                    )}

                    {tab === "orders" && (

                        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">

                            <table className="w-full">

                                <thead className="bg-slate-900 text-white">

                                    <tr>

                                        <th className="p-4">

                                            Invoice

                                        </th>

                                        <th>Date</th>

                                        <th>Total</th>

                                        <th>Status</th>

                                        <th>Payment</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {merchant.orders.map(order => (

                                        <tr key={order.id} className="border-b">

                                            <td className="p-4">

                                                {order.invoice}

                                            </td>

                                            <td>

                                                {new Date(order.createdAt).toLocaleDateString()}

                                            </td>

                                            <td>

                                                ₹{order.grandTotal}

                                            </td>

                                            <td>

                                                {order.status}

                                            </td>

                                            <td>

                                                {order.paymentStatus}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {tab === "credit" && (

                        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">

                            <table className="w-full">

                                <thead className="bg-slate-900 text-white">

                                    <tr>

                                        <th className="p-4">

                                            Invoice

                                        </th>

                                        <th>Amount</th>

                                        <th>Paid</th>

                                        <th>Balance</th>

                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {merchant.creditNotes.map(note => (

                                        <tr key={note.id} className="border-b">

                                            <td className="p-4">

                                                {note.invoice}

                                            </td>

                                            <td>

                                                ₹{note.amount}

                                            </td>

                                            <td>

                                                ₹{note.paidAmount}

                                            </td>

                                            <td>

                                                ₹{note.balance}

                                            </td>

                                            <td>

                                                {note.status}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </AnimatedPage>

    );

}
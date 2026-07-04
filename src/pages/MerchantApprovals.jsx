import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getPendingMerchants, approveMerchant } from "../api/admin";

export default function MerchantApprovals() {

    const [merchants, setMerchants] = useState([]);

    const loadMerchants = async () => {

        try {

            const res = await getPendingMerchants();

            setMerchants(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadMerchants();

    }, []);

    const approve = async (id) => {

        try {

            await approveMerchant(id);

            alert("Merchant Approved");

            loadMerchants();

        } catch (err) {

            alert("Unable to approve");

        }

    };

    return (

        <AdminLayout>

            <div className="bg-white rounded-xl shadow p-6">

                <h1 className="text-3xl font-bold mb-6">

                    Merchant Approvals

                </h1>

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="p-3">Shop</th>

                            <th>Owner</th>

                            <th>Email</th>

                            <th>GST</th>

                            <th>Phone</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {merchants.map((m) => (

                            <tr key={m.id} className="border-b">

                                <td className="p-3">{m.shopName}</td>

                                <td>{m.ownerName}</td>

                                <td>{m.email}</td>

                                <td>{m.gstNumber}</td>

                                <td>{m.phone}</td>

                                <td>

                                    <button

                                        onClick={() => approve(m.id)}

                                        className="bg-green-600 text-white px-4 py-2 rounded"

                                    >

                                        Approve

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </AdminLayout>

    );

}
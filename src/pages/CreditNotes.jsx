import { useEffect, useState } from "react";
import { getCreditNotes, markPaid } from "../api/credit";
import AdminLayout from "../components/AdminLayout";

export default function CreditNotes() {

    const [notes, setNotes] = useState([]);

    const loadNotes = async () => {

        try {

            const res = await getCreditNotes();

            setNotes(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadNotes();

    }, []);

    const handlePaid = async (id) => {

        try {

            await markPaid(id);

            loadNotes();

            alert("Credit Note Marked as Paid");

        }

        catch (err) {

            alert("Unable to update");

        }

    };

    const outstanding = notes
        .filter(n => n.status === "Pending")
        .reduce((sum, n) => sum + n.balance, 0);

    return (

        <AdminLayout>

            <h1 className="text-3xl font-bold mb-6">

                Credit Notes

            </h1>

            <div className="bg-red-600 text-white rounded-xl p-6 mb-8 w-fit shadow">

                <h3>Outstanding Credit</h3>

                <p className="text-3xl font-bold">

                    ₹{outstanding.toLocaleString()}

                </p>

            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">Invoice</th>

                            <th className="text-left">Merchant</th>

                            <th className="text-left">Amount</th>

                            <th className="text-left">Balance</th>

                            <th className="text-left">Due Date</th>

                            <th className="text-left">Status</th>

                            <th className="text-left">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {notes.map((note) => (

                            <tr
                                key={note.id}
                                className="border-t"
                            >

                                <td className="p-4">

                                    {note.invoice}

                                </td>

                                <td>

                                    {note.merchant.shopName}

                                </td>

                                <td>

                                    ₹{note.amount.toFixed(2)}

                                </td>

                                <td>

                                    ₹{note.balance.toFixed(2)}

                                </td>

                                <td>

                                    {new Date(
                                        note.dueDate
                                    ).toLocaleDateString()}

                                </td>

                                <td>

                                    {note.status === "Paid" ? (

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                            Paid

                                        </span>

                                    ) : (

                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                                            Pending

                                        </span>

                                    )}

                                </td>

                                <td>

                                    {note.status === "Pending" ? (

                                        <button

                                            onClick={() =>
                                                handlePaid(note.id)
                                            }

                                            className="bg-green-600 text-white px-4 py-2 rounded"

                                        >

                                            Mark Paid

                                        </button>

                                    ) : (

                                        <span className="text-green-600 font-semibold">

                                            Settled

                                        </span>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </AdminLayout>

    );

}
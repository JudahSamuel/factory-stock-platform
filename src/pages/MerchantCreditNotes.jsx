import { useEffect, useState } from "react";
import { getMerchantCreditNotes } from "../api/credit";
import BottomNavigation from "../components/BottomNavigation";

export default function MerchantCreditNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const merchant = JSON.parse(localStorage.getItem("merchant"));

      const res = await getMerchantCreditNotes(merchant.id);

      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const outstanding = notes
    .filter((n) => n.status === "Pending")
    .reduce((sum, n) => sum + n.balance, 0);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          My Credit Notes
        </h1>

        <div className="bg-red-600 text-white rounded-xl p-6 mb-8 shadow">
          <h3 className="text-lg">Outstanding Credit</h3>

          <p className="text-3xl font-bold mt-2">
            ₹{outstanding.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Invoice</th>

                <th className="text-left">Amount</th>

                <th className="text-left">Balance</th>

                <th className="text-left">Due Date</th>

                <th className="text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {notes.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-500"
                  >
                    No Credit Notes Found
                  </td>

                </tr>

              ) : (

                notes.map((note) => (

                  <tr
                    key={note.id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {note.invoice}
                    </td>

                    <td>
                      ₹{note.amount.toFixed(2)}
                    </td>

                    <td>
                      ₹{note.balance.toFixed(2)}
                    </td>

                    <td>
                      {new Date(note.dueDate).toLocaleDateString()}
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

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      <BottomNavigation />

    </div>
  );
}
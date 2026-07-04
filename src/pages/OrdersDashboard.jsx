import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export default function OrdersDashboard() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);

      }
    );

    return () => unsubscribe();

  }, []);

  const approveOrder = async (order) => {

    try {

      const inventoryRef =
        doc(
          db,
          "inventory",
          order.product
        );

      const inventorySnap =
        await getDoc(inventoryRef);

      if (!inventorySnap.exists()) {

        alert("Product not found");

        return;

      }

      const inventoryData =
        inventorySnap.data();

      const currentStock =
        inventoryData.stock || 0;

      if (
        currentStock < order.quantity
      ) {

        alert(
          "Insufficient stock"
        );

        return;

      }

      const newStock =
        currentStock -
        order.quantity;

      await updateDoc(
        inventoryRef,
        {
          stock: newStock,
        }
      );

      await updateDoc(
        doc(
          db,
          "orders",
          order.id
        ),
        {
          status: "Approved",
        }
      );

      alert(
        "Order Approved"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Approval Failed"
      );

    }

  };

  const rejectOrder = async (
    orderId
  ) => {

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {
        status: "Rejected",
      }
    );

  };

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Orders Dashboard
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4 text-left">
                Merchant
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map(order => (

              <tr
                key={order.id}
                className="border-t"
              >

                <td className="p-4">
                  {order.merchantName}
                </td>

                <td className="p-4">
                  {order.product}
                </td>

                <td className="p-4">
                  {order.quantity}
                </td>

                <td className="p-4">
                  {order.status}
                </td>

                <td className="p-4 flex gap-2">

                  {order.status ===
                  "Pending" ? (

                    <>

                      <button
                        onClick={() =>
                          approveOrder(
                            order
                          )
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          rejectOrder(
                            order.id
                          )
                        }
                        className="bg-red-600 text-white px-3 py-2 rounded"
                      >
                        Reject
                      </button>

                    </>

                  ) : (

                    <span>
                      Completed
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}
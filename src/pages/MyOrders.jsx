import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/order";
export default function MyOrders() {

    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    const merchant = JSON.parse(
        localStorage.getItem("merchant")
    );

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            const res = await getOrders(
                merchant.id
            );

            setOrders(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const badgeColor = (status) => {

    switch(status){

        case "Pending":
            return "bg-yellow-100 text-yellow-700";

        case "Approved":
            return "bg-green-100 text-green-700";

        case "Packed":
            return "bg-blue-100 text-blue-700";

        case "Dispatched":
            return "bg-purple-100 text-purple-700";

        case "Delivered":
            return "bg-emerald-100 text-emerald-700";

        case "Rejected":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100";

    }

};

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <h1 className="text-4xl font-bold mb-8">

                My Orders

            </h1>

            {

                orders.length === 0 ?

                    (

                        <div className="bg-white p-8 rounded-xl shadow">

                            No Orders Yet

                        </div>

                    )

                    :

                    (

                        <div className="space-y-6">

                            {

                                orders.map(order => (

                                    <div

                                        key={order.id}

                                        className="bg-white rounded-xl shadow p-6"

                                    >

                                        <div className="flex justify-between">

                                            <div>

                                                <h2 className="text-xl font-bold">

                                                    {order.invoice}

                                                </h2>

                                                <p className="text-gray-500">

                                                    {

                                                        new Date(

                                                            order.createdAt

                                                        ).toLocaleString()

                                                    }

                                                </p>

                                            </div>

                                            <div>

                                                <span
className={`px-4 py-2 rounded-full font-semibold ${badgeColor(order.status)}`}
>
    {order.status}
</span>

                                            </div>

                                        </div>

                                        <table className="w-full mt-6">

                                            <thead>

                                                <tr>

                                                    <th className="text-left">

                                                        Product

                                                    </th>

                                                    <th>

                                                        Qty

                                                    </th>

                                                    <th>

                                                        Rate

                                                    </th>

                                                    <th>

                                                        GST

                                                    </th>

                                                    <th>

                                                        Amount

                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {

                                                    order.items.map(item => (

                                                        <tr key={item.id}>

                                                            <td>

                                                                {item.product}

                                                            </td>

                                                            <td className="text-center">

                                                                {item.quantity}

                                                            </td>

                                                            <td className="text-center">

                                                                ₹{item.rate}

                                                            </td>

                                                            <td className="text-center">

                                                                {item.gst}%

                                                            </td>

                                                            <td className="text-center">

                                                                ₹{item.amount}

                                                            </td>

                                                        </tr>

                                                    ))

                                                }

                                            </tbody>

                                        </table>

                                        <div className="mt-6 flex justify-between items-center">

    {(order.status === "Approved" ||
  order.status === "Delivered") ? (

    <button
        onClick={() => navigate(`/invoice/${order.id}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
        View Invoice
    </button>

) : (

    <span className="text-orange-600 font-semibold">
        Waiting for admin approval...
    </span>

)}

    <h2 className="text-2xl font-bold">

        ₹{order.grandTotal.toFixed(2)}

    </h2>

</div>

                                        {order.status !== "Pending" && (

<div className="mt-6 border-t pt-6">

<h3 className="text-lg font-bold mb-4">

Delivery Information

</h3>

<div className="grid md:grid-cols-2 gap-5">

<div>

<p className="text-gray-500 text-sm">

Delivery Partner

</p>

<p className="font-semibold">

{order.deliveryPartner || "-"}

</p>

</div>

<div>

<p className="text-gray-500 text-sm">

Vehicle Number

</p>

<p className="font-semibold">

{order.vehicleNumber || "-"}

</p>

</div>

<div>

<p className="text-gray-500 text-sm">

Dispatch Date

</p>

<p>

{

order.dispatchDate

?

new Date(order.dispatchDate).toLocaleDateString()

:

"-"

}

</p>

</div>

<div>

<p className="text-gray-500 text-sm">

Expected Delivery

</p>

<p>

{

order.expectedDate

?

new Date(order.expectedDate).toLocaleDateString()

:

"-"

}

</p>

</div>

<div>

<p className="text-gray-500 text-sm">

Delivered On

</p>

<p>

{

order.deliveredDate

?

new Date(order.deliveredDate).toLocaleDateString()

:

"Not Delivered"

}

</p>

</div>

</div>

</div>

)}

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </div>

    );

}
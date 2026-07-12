import React, {

useEffect,

useMemo,

useState

} from "react";

import {

    sendInvoiceEmail

} from "../api/email";

import { useNavigate } from "react-router-dom";
import {
    getAllOrders,
    updateStatus,
    updatePayment,
    updateDelivery
} from "../api/admin";

import {
    createCreditNote
} from "../api/credit";

export default function AdminOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [expandedOrder, setExpandedOrder] =
        useState(null);

    const [discounts, setDiscounts] =
        useState({});

    const [deliveryData, setDeliveryData] = useState({});

    const loadOrders = async () => {

        try {

            setLoading(true);

            const res =
                await getAllOrders();

            setOrders(res.data);

        }

        catch (err) {

    console.log(err);

    console.log(err.response);

    console.log(err.response?.data);

    alert(

        JSON.stringify(

            err.response?.data ||

            err.message

        )

    );

}
finally {

        setLoading(false);

    }

};

    useEffect(() => {

        loadOrders();

    }, []);

    //---------------------------------------------------
    // SEARCH + FILTER
    //---------------------------------------------------

    const filteredOrders =
        useMemo(() => {

            return orders.filter(order => {

                const searchMatch =

                    order.invoice
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

                    ||

                    (order.merchant?.shopName || "Unknown Merchant")
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const statusMatch =

                    statusFilter === "All"

                    ||

                    order.status ===
                    statusFilter;

                return (
                    searchMatch &&
                    statusMatch
                );

            });

        }, [

            orders,

            search,

            statusFilter

        ]);

    //---------------------------------------------------
    // DASHBOARD CARDS
    //---------------------------------------------------

    const totalOrders =
        filteredOrders.length;

    const pendingOrders =
        filteredOrders.filter(

            o =>

                o.status ===
                "Pending"

        ).length;

    const approvedOrders =
        filteredOrders.filter(

            o =>

                o.status ===
                "Approved"

        ).length;

    const deliveredOrders =
        filteredOrders.filter(

            o =>

                o.status ===
                "Delivered"

        ).length;

    const totalRevenue =
        filteredOrders.reduce(

            (sum, order) =>

                sum +

                Number(
                    order.grandTotal
                ),

            0

        );

    //---------------------------------------------------
    // STATUS COLORS
    //---------------------------------------------------

    const badgeColor =
        (status) => {

            switch (status) {

                case "Pending":

                    return
                    "bg-yellow-100 text-yellow-700";

                case "Approved":

                    return
                    "bg-green-100 text-green-700";

                case "Packed":

                    return
                    "bg-blue-100 text-blue-700";

                case "Dispatched":

                    return
                    "bg-purple-100 text-purple-700";

                case "Delivered":

                    return
                    "bg-emerald-100 text-emerald-700";

                case "Rejected":

                    return
                    "bg-red-100 text-red-700";

                default:

                    return
                    "bg-gray-100 text-gray-700";

            }

        };

    //---------------------------------------------------
    // NEXT STATUS
    //---------------------------------------------------

    const getNextStatus =
        (status) => {

            switch (status) {

                case "Pending":

                    return "Approved";

                case "Approved":

                    return "Packed";

                case "Packed":

                    return "Dispatched";

                case "Dispatched":

                    return "Delivered";

                default:

                    return null;

            }

        };
    //---------------------------------------------------
    // UPDATE ORDER STATUS
    //---------------------------------------------------

    const changeStatus = async (order) => {

    try {

        const nextStatus = getNextStatus(order.status);

        if (!nextStatus) return;

        const discount = Number(
            discounts[order.id] || 0
        );

        await updateStatus(

            order.id,

            nextStatus,

            discount

        );

        await loadOrders();

    }

    catch (err) {

        console.log(err);

        alert(

            err?.response?.data?.message ||

            "Unable to update status"

        );

    }

};

    //---------------------------------------------------
    // REJECT ORDER
    //---------------------------------------------------

    const rejectOrder = async (order) => {

        try {

            await updateStatus(

                order.id,

                "Rejected"

            );

            await loadOrders();

        }

        catch (err) {

            console.log(err);

        }

    };

    //---------------------------------------------------
    // MARK PAYMENT
    //---------------------------------------------------

    const markPaid = async (order) => {

        try {

            await updatePayment(

                order.id,

                "Paid"

            );

            await loadOrders();

        }

        catch (err) {

            console.log(err);

        }

    };

    const createCredit = async (order) => {
    try {
        console.log("Creating credit for Order ID:", order.id);

        const res = await createCreditNote(order.id);

        console.log(res.data);

        alert("Credit Note Created Successfully");

        await loadOrders();

    } catch (err) {

        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);

        alert(
            JSON.stringify(
                err.response?.data ||
                err.message
            )
        );
    }
};

    const saveDelivery = async (order) => {

    try {
        console.log("Sending Delivery Data:", deliveryData[order.id]);

        await updateDelivery(

            order.id,

            deliveryData[order.id]

        );

        await sendInvoiceEmail(order.id);

        await loadOrders(); 

        alert("Delivery details saved and invoice emailed.");

    }

    catch (err) {

        console.log(err);

        alert("Unable to save delivery");

    }

};

    //---------------------------------------------------
    // APPLY DISCOUNT
    //---------------------------------------------------

    const applyDiscount = (

        order

    ) => {

        const percent =
            Number(

                discounts[
                    order.id
                ] || 0

            );

        const discountAmount =

            Number(

                (
                    order.subtotal *

                    percent /

                    100

                ).toFixed(2)

            );

        const taxable =

            Number(

                (

                    order.subtotal -

                    discountAmount

                ).toFixed(2)

            );

        const gst =

            Number(

                (

                    taxable *

                    (

                        order.gst /

                        order.subtotal

                    )

                ).toFixed(2)

            );

        return {

            discountAmount,

            taxable,

            gst,

            grand:

                taxable +

                gst

        };

    };

    //---------------------------------------------------
    // TOGGLE EXPAND
    //---------------------------------------------------

    const toggleOrder = (id) => {

        if (

            expandedOrder === id

        ) {

            setExpandedOrder(null);

        }

        else {

            setExpandedOrder(id);

        }

    };

    //---------------------------------------------------
    // ORDER COUNTS
    //---------------------------------------------------

    const paidOrders =

        filteredOrders.filter(

            order =>

                order.paymentStatus ===
                "Paid"

        ).length;

    const pendingPayments =

        filteredOrders.filter(

            order =>

                order.paymentStatus !==
                "Paid"

        ).length;

    //---------------------------------------------------
    // DATE FORMAT
    //---------------------------------------------------

    const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN");
};

      return (

        <div className="min-h-screen bg-slate-100 p-8">

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        Admin Orders

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Manage all merchant orders

                    </p>

                </div>

            </div>

            {/* Dashboard Cards */}

            <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6 mb-8">

                <div className="bg-blue-600 text-white rounded-2xl shadow p-6">

                    <h3 className="text-sm opacity-80">

                        Total Orders

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {totalOrders}

                    </p>

                </div>

                <div className="bg-yellow-500 text-white rounded-2xl shadow p-6">

                    <h3 className="text-sm opacity-80">

                        Pending

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {pendingOrders}

                    </p>

                </div>

                <div className="bg-green-600 text-white rounded-2xl shadow p-6">

                    <h3 className="text-sm opacity-80">

                        Approved

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {approvedOrders}

                    </p>

                </div>

                <div className="bg-purple-600 text-white rounded-2xl shadow p-6">

                    <h3 className="text-sm opacity-80">

                        Delivered

                    </h3>

                    <p className="text-4xl font-bold mt-2">

                        {deliveredOrders}

                    </p>

                </div>

                <div className="bg-red-600 text-white rounded-2xl shadow p-6">

                    <h3 className="text-sm opacity-80">

                        Revenue

                    </h3>

                    <p className="text-3xl font-bold mt-2">

                        ₹{Number(totalRevenue).toLocaleString()}

                    </p>

                </div>

            </div>

            {/* Search */}

            <div className="bg-white rounded-2xl shadow p-6 mb-8">

                <div className="grid md:grid-cols-2 gap-4">

                    <input

                        value={search}

                        onChange={(e)=>

                            setSearch(e.target.value)

                        }

                        placeholder="Search Invoice or Merchant"

                        className="border rounded-lg p-3"

                    />

                    <select

                        value={statusFilter}

                        onChange={(e)=>

                            setStatusFilter(e.target.value)

                        }

                        className="border rounded-lg p-3"

                    >

                        <option>All</option>

                        <option>Pending</option>

                        <option>Approved</option>

                        <option>Packed</option>

                        <option>Dispatched</option>

                        <option>Delivered</option>

                        <option>Rejected</option>

                    </select>

                </div>

            </div>

            {/* Orders Table */}

            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">

                                Invoice

                            </th>

                            <th className="text-left">

                                Merchant

                            </th>

                            <th>

                                Date

                            </th>

                            <th>

                                Amount

                            </th>

                            <th>

                                Status

                            </th>

                            <th>

                                Payment

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                            (

                                <tr>

                                    <td

                                        colSpan="7"

                                        className="text-center p-10"

                                    >

                                        Loading...

                                    </td>

                                </tr>

                            )

                            :

                            filteredOrders.length===0 ?

                            (

                                <tr>

                                    <td

                                        colSpan="7"

                                        className="text-center p-10"

                                    >

                                        No Orders Found

                                    </td>

                                </tr>

                            )

                            :

                            filteredOrders.map(order=>(

                                <React.Fragment key={order.id}>

                                    <tr

                                        

                                        className="border-t hover:bg-slate-50 transition"

                                    >

                                        <td className="p-4 font-semibold">

                                            {order.invoice}

                                        </td>

                                        <td>

                                            {order.merchant?.shopName || "Unknown Merchant"}

                                        </td>

                                        <td>

                                            {formatDate(order.createdAt)}

                                        </td>

                                        <td className="font-bold">

                                            ₹{Number(order.grandTotal).toLocaleString()}

                                        </td>

                                        <td>

                                            <span

                                                className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor(order.status)}`}

                                            >

                                                {order.status}

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                order.paymentStatus==="Paid"

                                                ?

                                                <span className="text-green-600 font-semibold">

                                                    Paid

                                                </span>

                                                :

                                                <span className="text-red-600 font-semibold">

                                                    Pending

                                                </span>

                                            }

                                        </td>

                                        

                                        <td>

<div className="flex gap-3">

<button

onClick={()=>toggleOrder(order.id)}

className="text-blue-600 hover:underline"

>

{

expandedOrder===order.id

?

"Hide"

:

"View"

}

</button>

<button

onClick={()=>navigate(`/invoice/${order.id}`)}

className="text-red-600 hover:underline"

>

Invoice

</button>

</div>

</td>

                                    </tr>

                                      {

                                        expandedOrder===order.id && (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="bg-slate-50 p-6"
                                                >

                                                    <div className="grid lg:grid-cols-2 gap-8">

                                                        {/* Products */}

                                                        <div>

                                                            <h2 className="text-lg font-bold mb-4">

                                                                Ordered Products

                                                            </h2>

                                                            <table className="w-full">

                                                                <thead>

                                                                    <tr className="border-b">

                                                                        <th className="text-left py-2">

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

                                                                        order.items?.map(item=>(

                                                                            <tr
                                                                                key={item.id}
                                                                                className="border-b"
                                                                            >

                                                                                <td className="py-2">

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

                                                        </div>

                                                        {/* Summary */}

                                                        <div>

                                                            <h2 className="text-lg font-bold mb-4">

                                                                Order Summary

                                                            </h2>

                                                            <div className="space-y-3">

                                                                <div className="flex justify-between">

                                                                    <span>Subtotal</span>

                                                                    <span>

                                                                        ₹{Number(order.subtotal).toFixed(2)}

                                                                    </span>

                                                                </div>

                                                                <div className="flex justify-between">

                                                                    <span>GST</span>

                                                                    <span>

                                                                        ₹{Number(order.gst).toFixed(2)}

                                                                    </span>

                                                                </div>

                                                                {

                                                                    order.status==="Pending" && (

                                                                        <>

                                                                            <div>

                                                                                <label className="text-sm font-medium">

                                                                                    Discount %

                                                                                </label>

                                                                                <input

                                                                                    type="number"

                                                                                    min="0"

                                                                                    max="100"

                                                                                    value={discounts[order.id] || ""}

                                                                                    onChange={(e)=>

                                                                                        setDiscounts({

                                                                                            ...discounts,

                                                                                            [order.id]:e.target.value

                                                                                        })

                                                                                    }

                                                                                    className="border rounded-lg p-2 w-24 mt-2"

                                                                                />

                                                                            </div>

                                                                        </>

                                                                    )

                                                                }

                                                                {

                                                                    order.status==="Pending"

                                                                    &&

                                                                    (()=>{

                                                                        const calc=

                                                                            applyDiscount(order);

                                                                        return(

                                                                            <>

                                                                                <div className="flex justify-between">

                                                                                    <span>

                                                                                        Discount

                                                                                    </span>

                                                                                    <span>

                                                                                        ₹{calc.discountAmount.toFixed(2)}

                                                                                    </span>

                                                                                </div>

                                                                                <div className="flex justify-between">

                                                                                    <span>

                                                                                        Grand Total

                                                                                    </span>

                                                                                    <span className="font-bold text-xl">

                                                                                        ₹{calc.grand.toFixed(2)}

                                                                                    </span>

                                                                                </div>

                                                                            </>

                                                                        )

                                                                    })()

                                                                }

                                                                {

                                                                    order.status!=="Pending"

                                                                    &&

                                                                    <div className="flex justify-between">

                                                                        <span>

                                                                            Grand Total

                                                                        </span>

                                                                        <span className="font-bold text-xl">

                                                                            ₹{Number(order.grandTotal).toFixed(2)}

                                                                        </span>

                                                                    </div>

                                                                }

                                                            </div>

                                                            {order.status !== "Pending" && (

<div className="mt-8 border rounded-xl p-5">

<h2 className="text-lg font-bold mb-4">

Delivery Details

</h2>

<div className="grid md:grid-cols-2 gap-4">

<input

placeholder="Delivery Partner"

value={

deliveryData[order.id]?.deliveryPartner ||

order.deliveryPartner ||

""

}

onChange={(e)=>

setDeliveryData({

...deliveryData,

[order.id]:{

...deliveryData[order.id],

deliveryPartner:e.target.value

}

})

}

className="border rounded-lg p-3"

/>

<input

placeholder="Vehicle Number"

value={

deliveryData[order.id]?.vehicleNumber ||

order.vehicleNumber ||

""

}

onChange={(e)=>

setDeliveryData({

...deliveryData,

[order.id]:{

...deliveryData[order.id],

vehicleNumber:e.target.value

}

})

}

className="border rounded-lg p-3"

/>

<input

type="date"

value={
    deliveryData[order.id]?.dispatchDate ||
    (order.dispatchDate
        ? order.dispatchDate.slice(0, 10)
        : "")
}

onChange={(e)=>

setDeliveryData({

...deliveryData,

[order.id]:{

...deliveryData[order.id],

dispatchDate:e.target.value

}

})

}

className="border rounded-lg p-3"

/>

<input

type="date"

value={
    deliveryData[order.id]?.expectedDate ||
    (order.expectedDate
        ? order.expectedDate.slice(0, 10)
        : "")
}

onChange={(e)=>

setDeliveryData({

...deliveryData,

[order.id]:{

...deliveryData[order.id],

expectedDate:e.target.value

}

})

}

className="border rounded-lg p-3"

/>

</div>

<button

onClick={()=>saveDelivery(order)}

className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"

>

Save Delivery

</button>

</div>

)}

                                                            <div className="flex flex-wrap gap-3 mt-8">

                                                                {

                                                                    order.status==="Pending" && (

                                                                        <>

                                                                            <button

                                                                                onClick={()=>changeStatus(order)}

                                                                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"

                                                                            >

                                                                                Approve

                                                                            </button>

                                                                            <button

                                                                                onClick={()=>rejectOrder(order)}

                                                                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"

                                                                            >

                                                                                Reject

                                                                            </button>

                                                                            

                                                                        </>

                                                                    )

                                                                }

                                                                {

                                                                    order.status!=="Pending"

                                                                    &&

                                                                    getNextStatus(order.status)

                                                                    &&

                                                                    <button

                                                                        onClick={()=>changeStatus(order)}

                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

                                                                    >

                                                                        Mark {getNextStatus(order.status)}

                                                                    </button>

                                                                }

                                                                {
    order.paymentStatus !== "Paid" && (

        <button
            onClick={() => markPaid(order)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
        >
            Mark Paid
        </button>

    )
}

                                                                

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>

                                            </tr>

                                        )

                                    }

                                </React.Fragment>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}
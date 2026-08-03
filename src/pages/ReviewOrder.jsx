import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../api/order";

export default function ReviewOrder() {

    const navigate = useNavigate();
    const { state } = useLocation();

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl font-bold">
                    No Order Found
                </h2>
            </div>
        );
    }

    const {

        merchantId,

        buyer,

        shippingDetails,

        items,

        subtotal,

        gst,

        grandTotal

    } = state;

    const placeOrder = async () => {

        try {

            await createOrder({

                merchantId,

                buyer,

                shippingDetails,

                items,

                subtotal,

                gst,

                grandTotal

            });

            alert("Order placed successfully.");

            navigate("/my-orders");

        }

        catch (err) {

            console.log(err);

            alert("Unable to place order.");

        }

    };

    return (

<div className="min-h-screen bg-slate-100 p-8">

<div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

<h1 className="text-3xl font-bold mb-8">
Review Your Order
</h1>

{/* Buyer Details */}

<div className="border rounded-lg p-5 mb-8">

<h2 className="text-xl font-semibold mb-4">
Buyer Details
</h2>

<div className="grid grid-cols-2 gap-4">

<div>

<p><b>Shop Name</b></p>
<p>{buyer.shopName}</p>

</div>

<div>

<p><b>GST Number</b></p>
<p>{buyer.merchantGST}</p>

</div>

<div>

<p><b>Address</b></p>
<p>{buyer.merchantAddress}</p>

</div>

<div>

<p><b>State</b></p>
<p>{buyer.merchantState}</p>

</div>

<div>

<p><b>Place Of Supply</b></p>
<p>{buyer.merchantPlaceOfSupply}</p>

</div>

<div>

<p><b>Contact Person</b></p>
<p>{buyer.merchantContactPerson}</p>

</div>

<div>

<p><b>Mobile</b></p>
<p>{buyer.merchantMobile}</p>

</div>

</div>

</div>

{/* Order Details */}

<div className="border rounded-lg p-5 mb-8">

<h2 className="text-xl font-semibold mb-4">
Order Details
</h2>

<div className="grid grid-cols-2 gap-4">

<div>

<p><b>Delivery Note</b></p>
<p>{shippingDetails.deliveryNote || "-"}</p>

</div>

<div>

<p><b>Buyer's Order No.</b></p>
<p>{shippingDetails.buyersOrderNo || "-"}</p>

</div>

<div className="col-span-2">

<p><b>Remarks</b></p>
<p>{shippingDetails.remarks || "-"}</p>

</div>

</div>

</div>

{/* Items */}

<div className="border rounded-lg overflow-hidden">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-3 border">Product</th>

<th className="p-3 border">HSN</th>

<th className="p-3 border">Qty</th>

<th className="p-3 border">Rate</th>

<th className="p-3 border">GST</th>

<th className="p-3 border">Amount</th>

</tr>

</thead>

<tbody>

{items.map((item,index)=>(

<tr key={index}>

<td className="border p-3">
{item.product}
</td>

<td className="border p-3 text-center">
{item.hsn}
</td>

<td className="border p-3 text-center">
{item.quantity}
</td>

<td className="border p-3 text-center">
₹{item.rate}
</td>

<td className="border p-3 text-center">
{item.gstRate}%
</td>

<td className="border p-3 text-center">
₹{(item.quantity*item.rate).toFixed(2)}
</td>

</tr>

))}

</tbody>

</table>

</div>

{/* Totals */}

<div className="flex justify-end mt-8">

<div className="w-96 border rounded-lg p-5">

<div className="flex justify-between mb-3">

<span>Subtotal</span>

<span>
₹{subtotal.toFixed(2)}
</span>

</div>

<div className="flex justify-between mb-3">

<span>GST</span>

<span>
₹{gst.toFixed(2)}
</span>

</div>

<hr className="my-3"/>

<div className="flex justify-between text-xl font-bold">

<span>Grand Total</span>

<span>
₹{grandTotal.toFixed(2)}
</span>

</div>

</div>

</div>

{/* Buttons */}

<div className="flex justify-end gap-4 mt-10">

<button

onClick={()=>navigate(-1)}

className="px-6 py-3 border rounded-lg"

>

Edit Order

</button>

<button

onClick={placeOrder}

className="px-6 py-3 bg-green-600 text-white rounded-lg"

>

Place Order

</button>

</div>

</div>

</div>

);

}
import { generateInvoicePDF } from "../utils/generateInvoicePDF";
import { getProducts } from "../api/product";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";

const indianStates = [

  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",

  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"

];

export default function Checkout() {

  
  const [loading, setLoading] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([
    {
    product: "",
    hsn: "",
    unit: "",
    quantity: 1,
    rate: 0,
    gstRate: 5
}
]);
  

  const [shippingDetails, setShippingDetails] = useState({
    deliveryNote: "",
    buyersOrderNo: "",
    supplierRef: "",
    transporterName: "",
    lrNumber: "",
    remarks: "",
    dispatchDocumentNo: "",
    dispatchedThrough: "",
    destination: "",
    vehicleNumber: "",
    termsOfDelivery: "",
});

  const [taxType, setTaxType] =
  useState("CGST_SGST");
  const [merchantName, setMerchantName] = useState("");

const [merchantGST, setMerchantGST] = useState("");

const [merchantAddress, setMerchantAddress] = useState("");

const [merchantState, setMerchantState] =
    useState("Karnataka");

const [merchantPlaceOfSupply, setMerchantPlaceOfSupply] =
    useState("Karnataka");

const [merchantContactPerson, setMerchantContactPerson] =
    useState("");

const [merchantMobile, setMerchantMobile] =
    useState("");

useEffect(() => {
    loadProducts();
}, []);

const loadProducts = async () => {

    try {

        const res = await getProducts();

        setProducts(res.data);

    } catch (err) {

        console.log(err);

    }

};
  const validateInvoice = () => {

    const missing = [];

    if (!merchantAddress?.trim())
      missing.push("Address");

    if (!merchantState?.trim())
      missing.push("State");

    if (!merchantPlaceOfSupply?.trim())
      missing.push("Place Of Supply");

    if (!merchantContactPerson?.trim())
      missing.push("Contact Person");

    if (!merchantMobile?.trim())
      missing.push("Phone Number");

    if (!merchantName?.trim())
    missing.push("Shop Name");

if (!merchantGST?.trim())
    missing.push("GST Number");

    if (!shippingDetails.deliveryNote?.trim())
  missing.push("Delivery Note");

// Make PO Number optional.
// If you want it mandatory, uncomment these lines.

// if (!shippingDetails.buyersOrderNo?.trim())
//   missing.push("Buyer's Order Number");
    
    const emptyProduct = items.find(
    item => !item.product
);

if (emptyProduct) {

    alert("Please select a product for every row.");

    return false;

}

const invalidQty = items.find(
    item => item.quantity <= 0
);

if (invalidQty) {

    alert("Quantity must be greater than 0.");

    return false;

}

if (missing.length > 0) {

    alert(
        "Please fill the following fields:\n\n" +
        missing.join("\n")
    );

    return false;

}

return true;
};

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.quantity * item.rate,
    0
  );

  

  const discountAmount =
    subtotal * discountPercent / 100;

const taxableValue =
    subtotal - discountAmount;

const gstTotal = items.reduce(

    (sum, item) => {

        const itemTaxable =
            item.quantity *
            item.rate;

        const discounted =
            itemTaxable -
            (itemTaxable * discountPercent / 100);

        return sum + (discounted * item.gstRate / 100);

    },

    0

);

const cgst = gstTotal / 2;

const sgst = gstTotal / 2;

const grandTotal =
    taxableValue + gstTotal;

  const generateInvoice = () => {

    if (!validateInvoice()) return;

    generateInvoicePDF({

    invoiceNo: "INV" + Date.now(),

    date: new Date().toLocaleDateString("en-IN"),

    merchantName,
    merchantGST,
    merchantAddress,
    merchantState,
    merchantPlaceOfSupply,
    merchantContactPerson,
    merchantMobile,

    deliveryNote: shippingDetails.deliveryNote,
    buyersOrderNo: shippingDetails.buyersOrderNo,
    supplierRef: shippingDetails.supplierRef,
    transporterName: shippingDetails.transporterName,
    lrNumber: shippingDetails.lrNumber,
    remarks: shippingDetails.remarks,
    dispatchDocumentNo: shippingDetails.dispatchDocumentNo,
    dispatchedThrough: shippingDetails.dispatchedThrough,
    destination: shippingDetails.destination,
    vehicleNumber: shippingDetails.vehicleNumber,
    termsOfDelivery: shippingDetails.termsOfDelivery,

    items,

    subtotal,

    gstTotal,

    grandTotal,

    discountPercent,

    discountAmount,

    taxableAfterDiscount: taxableValue

});

};

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

        {/* LEFT SECTION */}

        <div className="md:col-span-3 bg-white rounded-xl shadow p-6">

          <h1 className="text-3xl font-bold">
            Lasya Enterprises
          </h1>

          <p className="text-gray-500 mt-2">
            Food Packing Items
          </p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <table className="w-full border">

            <thead>

              <tr className="bg-gray-100">

                <th className="p-3 border">
Product
</th>

<th className="p-3 border">
HSN
</th>

<th className="p-3 border">
Qty
</th>

                <th className="p-3 border">
                  Unit
                </th>

                <th className="p-3 border">
                  Rate
                </th>

                <th className="p-3 border">
                  GST %
                </th>

                <th className="p-3 border">
  GST Amount
</th>

<th className="p-3 border">
  Total
</th>

<th className="p-3 border">
  Action
</th>

              </tr>

            </thead>

            <tbody>

              {items.map(
                (item, index) => {

                  const taxableValue =
                    item.quantity *
                    item.rate;

                  const discountedTaxable =
    taxableValue -
    (taxableValue * discountPercent / 100);

const itemGST =
    discountedTaxable * item.gstRate / 100;

const itemTotal =
    discountedTaxable + itemGST;

                  

                  return (

                    <tr
                      key={index}
                    >

                      <td className="border p-3">
                        <select
    value={item.product}
    className="border p-2 rounded w-full"
    onChange={(e) => {

    const selected = products.find(
        p => p.product === e.target.value
    );

    if (!selected) return;

    const updated = [...items];

    updated[index] = {

        ...updated[index],

        product: selected.product,
        hsn: selected.hsn || "",
        unit: selected.unit,
        rate: selected.price,
        gstRate: selected.gst

    };

    setItems(updated);

}}
>

<option value="">
Select Product
</option>

{products
.filter(product =>
    !items.some(
        (i, idx) =>
            idx !== index &&
            i.product === product.product
    )
    || product.product === item.product
)
.map((product) => (

<option
key={product.id}
value={product.product}
>

{product.product}

</option>

))}

</select>
                      </td>

                      <td className="border p-3">

<input
    value={item.hsn}
    readOnly
    className="border p-2 rounded w-full bg-gray-100"
/>

</td>

                      <td className="border p-3 text-center">
                        <input
    type="number"
    min={1}
    value={item.quantity}
    onChange={(e) => {
        const updated = [...items];
        updated[index].quantity = Number(e.target.value);
        setItems(updated);
    }}
    className="border p-2 rounded w-20"
/>
                      </td>

                      <td className="border p-3 text-center">
                        <input
    value={item.unit}
    readOnly
    className="border p-2 rounded w-full bg-gray-100"
/>
                      </td>

                      <td className="border p-3 text-center">
                        <input
    type="number"
    value={item.rate}
    readOnly
    className="border p-2 rounded w-24 bg-gray-100"
/>
                      </td>

                      <td className="border p-3 text-center">
                        <input
    type="number"
    value={item.gstRate}
    readOnly
    className="border p-2 rounded w-20 bg-gray-100"
/>
                      </td>

                      <td className="border p-3 text-center">
                        ₹{itemGST.toFixed(2)}
                      </td>

                      <td className="border p-3 text-center">
    ₹{itemTotal.toFixed(2)}
</td>

<td className="border p-3 text-center">

    <button
        onClick={() => {

            const updated = items.filter(
                (_, i) => i !== index
            );

            setItems(

                updated.length

                    ? updated

                    : [

                        {

                            product: "",

                            hsn: "",

                            unit: "",

                            quantity: 1,

                            rate: 0,

                            gstRate: 5

                        }

                    ]

            );

        }}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >

        Remove

    </button>

</td>

</tr>

                  );
                }
              )}

            </tbody>

          </table>

          <button
    onClick={() =>
        setItems([
            ...items,
            {
                product: "",
                hsn: "",
                unit: "",
                quantity: 1,
                rate: 0,
                gstRate: 5
            }
        ])
    }
    disabled={items.length >= products.length}
    className={`mt-5 px-5 py-2 rounded text-white ${
        items.length >= products.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
    }`}
>
    + Add Another Product
</button>

          <div className="border rounded-lg p-5 mt-6">

            <h2 className="text-xl font-semibold mb-4">
              Buyer Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Shop Name"
                className="border p-3 rounded"
                value={merchantName}
                onChange={(e) =>
                  setMerchantName(e.target.value)
                }
              />

              <input
                placeholder="GST Number"
                className="border p-3 rounded"
                value={merchantGST}
                onChange={(e) =>
                  setMerchantGST(e.target.value)
                }
              />

              <input
                placeholder="Address"
                className="border p-3 rounded"
                value={merchantAddress}
                onChange={(e) =>
                  setMerchantAddress(e.target.value)
                }
              />

              

              <select
className="border p-3 rounded bg-white"
value={merchantState}
onChange={(e)=>{

setMerchantState(e.target.value);

setMerchantPlaceOfSupply(e.target.value);

}}

>

{indianStates.map((state)=>(

<option

key={state}

value={state}

>

{state}

</option>

))}

</select>

              <input
placeholder="Place Of Supply"
value={merchantPlaceOfSupply}
readOnly
className="border p-3 rounded bg-gray-100"
                onChange={(e) =>
                  setMerchantPlaceOfSupply(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Contact Person"
                className="border p-3 rounded"
                value={merchantContactPerson}
                onChange={(e) =>
                  setMerchantContactPerson(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Phone Number"
                className="border p-3 rounded"
                value={merchantMobile}
                onChange={(e) =>
                  setMerchantMobile(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        <div className="border rounded-lg p-5 mt-6">

          <h2 className="text-xl font-semibold mb-4">
            Order Details
          </h2>
          

          <div className="grid md:grid-cols-3 gap-4">

            <input
              placeholder="Delivery Note"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  deliveryNote:e.target.value
                })
              }
            />

            

            
            <input
              placeholder="Buyer's Order No"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  buyersOrderNo:e.target.value
                })
              }
            />

            <input
    placeholder="Supplier Reference"
    className="border p-3 rounded"
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            supplierRef:e.target.value
        })
    }
/>

<input
    placeholder="Transporter Name"
    className="border p-3 rounded"
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            transporterName:e.target.value
        })
    }
/>

<input
    placeholder="LR Number"
    className="border p-3 rounded"
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            lrNumber:e.target.value
        })
    }
/>

<input
    placeholder="Dispatch Document No"
    className="border p-3 rounded"
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            dispatchDocumentNo:e.target.value
        })
    }
/>

<select
    className="border p-3 rounded"
    value={shippingDetails.dispatchedThrough}
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            dispatchedThrough: e.target.value
        })
    }
>

    <option value="">Dispatched Through</option>
    <option value="Road">Road</option>
    <option value="Rail">Rail</option>
    <option value="Air">Air</option>
    <option value="Courier">Courier</option>
    <option value="Hand Delivery">Hand Delivery</option>

</select>

<input
    placeholder="Destination"
    className="border p-3 rounded"
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            destination:e.target.value
        })
    }
/>

<input
    placeholder="Vehicle Number"
    className="border p-3 rounded"
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            vehicleNumber:e.target.value
        })
    }
/>

<select
    className="border p-3 rounded"
    value={shippingDetails.termsOfDelivery}
    onChange={(e)=>
        setShippingDetails({
            ...shippingDetails,
            termsOfDelivery: e.target.value
        })
    }
>

    <option value="">
        Select Terms Of Delivery
    </option>

    <option value="Immediate">
        Immediate
    </option>

    <option value="Within 3 Days">
        Within 3 Days
    </option>

    <option value="Within 7 Days">
        Within 7 Days
    </option>

    <option value="As Per Agreement">
        As Per Agreement
    </option>

</select>



            <textarea
    placeholder="Remarks (Optional)"
    className="border p-3 rounded md:col-span-3"
    onChange={(e) =>
        setShippingDetails({
            ...shippingDetails,
            remarks: e.target.value,
        })
    }
/>

            

            

            

            

          </div>

        </div>

        

        </div>


        <div className="bg-white rounded-xl shadow p-6 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Price Details
          </h2>

          <div className="space-y-4">

            <div className="space-y-4">

    <div className="flex justify-between">
        <span>Taxable Value</span>
        <span>₹{subtotal.toFixed(2)}</span>
    </div>

    <div className="flex justify-between items-center">
        <span>Discount (%)</span>

        <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e)=>
                setDiscountPercent(Number(e.target.value))
            }
            className="border rounded w-20 p-1 text-right"
        />
    </div>

    <div className="flex justify-between">
        <span>Discount Amount</span>
        <span>₹{discountAmount.toFixed(2)}</span>
    </div>

    <div className="flex justify-between">
        <span>Taxable After Discount</span>
        <span>₹{taxableValue.toFixed(2)}</span>
    </div>

</div>

            

            <div className="flex justify-between">

              <span>
                CGST
              </span>

              <span>
                ₹{cgst.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between">

              <span>
                SGST
              </span>

              <span>
                ₹{sgst.toFixed(2)}
              </span>

            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">

              <span>
                Grand Total
              </span>

              <span>
                ₹{grandTotal.toFixed(2)}
              </span>

            </div>

          </div>

          <div className="mt-6 mb-4">



</div>

          <button

onClick={generateInvoice}

disabled={loading}

className={`

w-full

py-3

rounded-lg

mt-4

text-white

font-semibold

transition

${loading

? "bg-gray-400 cursor-not-allowed"

: "bg-green-600 hover:bg-green-700"

}

`}

>

{

loading

?

<div className="flex justify-center">

<Loader text="Generating Invoice..." />

</div>

:

"Generate Invoice"

}

</button>

        </div>

      </div>

    </div>

  );

}
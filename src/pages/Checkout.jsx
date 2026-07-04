import { useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";
import { createOrder } from "../api/order";

export default function Checkout() {

  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state || !state.items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          No Products Selected
        </h1>
      </div>
    );
  }

  const { items } = state;

  const [shippingDetails, setShippingDetails] =
  useState({
    deliveryNote: "",
    supplierRef: "",
    otherReference: "",
    buyersOrderNo: "",
    dispatchDocumentNo: "",
    transportMode: "",
    vehicleNumber: "",
    destination: "",
    termsOfDelivery: "",
  });
  const [taxType, setTaxType] =
  useState("CGST_SGST");
  const [merchantName, setMerchantName] =
    useState("Patel Commercial");

  const [merchantGST, setMerchantGST] =
    useState("29ABCDE1234F1Z5");

  const [merchantAddress, setMerchantAddress] =
    useState("");

  const [merchantState, setMerchantState] =
    useState("");

  const [merchantPlaceOfSupply, setMerchantPlaceOfSupply] =
    useState("");

  const [merchantContactPerson, setMerchantContactPerson] =
    useState("");

  const [merchantMobile, setMerchantMobile] =
    useState("");

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
      missing.push("Mobile Number");

    if (!shippingDetails.deliveryNote?.trim())
      missing.push("Delivery Note");

    if (!shippingDetails.supplierRef?.trim())
      missing.push("Supplier Reference");

    if (!shippingDetails.otherReference?.trim())
      missing.push("Other Reference");

    if (!shippingDetails.buyersOrderNo?.trim())
      missing.push("Buyer's Order Number");

    if (!shippingDetails.dispatchDocumentNo?.trim())
      missing.push("Dispatch Document Number");

    if (!shippingDetails.transportMode?.trim())
      missing.push("Transport Mode");

    if (!shippingDetails.destination?.trim())
      missing.push("Destination");

    if (!shippingDetails.vehicleNumber?.trim())
      missing.push("Vehicle Number");

    if (!shippingDetails.termsOfDelivery?.trim())
      missing.push("Terms Of Delivery");

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

  const gstTotal = items.reduce(
    (sum, item) =>
      sum +
      (
        item.quantity *
        item.rate *
        item.gstRate
      ) /
      100,
    0
  );

  const cgst =
    gstTotal / 2;

  const sgst =
    gstTotal / 2;

  const grandTotal =
    subtotal + gstTotal;

  const placeOrder = async () => {

    try {

        if (!validateInvoice()) return;

        const merchant = JSON.parse(
            localStorage.getItem("merchant")
        );

        await createOrder({

            merchantId: merchant.id,

            subtotal,

            gst: gstTotal,

            grandTotal,

            buyer:{

merchantName,

merchantGST,

merchantAddress,

merchantState,

merchantPlaceOfSupply,

merchantContactPerson,

merchantMobile

},

            shippingDetails,

            items

        });

        alert("Order Placed Successfully");

        navigate("/my-orders");

    }

    catch(err){

        console.log(err);

        alert("Failed to place order");

    }

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

              </tr>

            </thead>

            <tbody>

              {items.map(
                (item, index) => {

                  const taxableValue =
                    item.quantity *
                    item.rate;

                  const itemGST =
                    (
                      taxableValue *
                      item.gstRate
                    ) / 100;

                  const itemTotal =
                    taxableValue +
                    itemGST;

                  return (

                    <tr
                      key={index}
                    >

                      <td className="border p-3">
                        {item.product}
                      </td>

                      <td className="border p-3 text-center">
                        {item.quantity}
                      </td>

                      <td className="border p-3 text-center">
                        {item.unit}
                      </td>

                      <td className="border p-3 text-center">
                        ₹{item.rate}
                      </td>

                      <td className="border p-3 text-center">
                        {item.gstRate}%
                      </td>

                      <td className="border p-3 text-center">
                        ₹{itemGST.toFixed(2)}
                      </td>

                      <td className="border p-3 text-center">
                        ₹{itemTotal.toFixed(2)}
                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

          <div className="border rounded-lg p-5 mt-6">

            <h2 className="text-xl font-semibold mb-4">
              Buyer Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Merchant Name"
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

              

              <input
                placeholder="State"
                className="border p-3 rounded"
                value={merchantState}
                onChange={(e) =>
                  setMerchantState(e.target.value)
                }
              />

              <input
                placeholder="Place Of Supply"
                className="border p-3 rounded"
                value={merchantPlaceOfSupply}
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
                placeholder="Mobile Number"
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
            Shipping Details
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
              placeholder="Supplier Ref"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  supplierRef:e.target.value
                })
              }
            />

            <input
              placeholder="Other Reference"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  otherReference:e.target.value
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
              placeholder="Dispatch Document No"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  dispatchDocumentNo:e.target.value
                })
              }
            />

            <input
              placeholder="Transport Mode"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  transportMode:e.target.value
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
              placeholder="Terms Of Delivery"
              className="border p-3 rounded"
              onChange={(e)=>
                setShippingDetails({
                  ...shippingDetails,
                  termsOfDelivery:e.target.value
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

            <div className="flex justify-between">

              <span>
                Taxable Value
              </span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>

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

          

          <button
            onClick={placeOrder}
            className="w-full bg-green-600 text-white py-3 rounded-lg mt-4"
          >
            Request Order
          </button>

        </div>

      </div>

    </div>

  );

}
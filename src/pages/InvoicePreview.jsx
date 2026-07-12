import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvoice } from "../api/invoice";
import { generateInvoicePDF } from "../utils/generateInvoicePDF";
import logo from "../assets/lasya-logo.jpeg";
import { toWords } from "number-to-words";
import { useNavigate } from "react-router-dom";

export default function InvoicePreview() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(null);

useEffect(() => {

    loadInvoice();

}, []);

const loadInvoice = async () => {

    try {

        const res = await getInvoice(id);

        const order = res.data;
        if (order.status === "Pending") {

    alert("Invoice is not available until admin approval.");

    navigate("/my-orders");

    return;

}
        console.log("API Order:", order);
        console.log("Delivery values", {
    deliveryPartner: order.deliveryPartner,
    vehicleNumber: order.vehicleNumber,
    dispatchDate: order.dispatchDate,
    expectedDate: order.expectedDate,
    deliveredDate: order.deliveredDate
}); 

        setState({

            items: order.items,

            subtotal: order.subtotal,

            gstTotal: order.gst,

            grandTotal: order.grandTotal,

            merchantName: order.merchant.shopName,

            merchantGST: order.merchant.gstNumber,

            merchantAddress: order.shippingAddress,

            merchantState: order.state,

merchantPlaceOfSupply: order.placeOfSupply,

            merchantContactPerson: order.contactPerson,

            merchantMobile: order.phone,

            discountPercent: order.discountPercent,

            discountAmount: order.discountAmount,

            taxableAfterDiscount: order.taxableAmount,

            invoiceNo: order.invoice,

            invoiceDate: order.createdAt,

            shippingDetails: {

    deliveryNote: order.deliveryNote,

    supplierRef: order.supplierRef,

    otherReference: order.otherReference,

    buyersOrderNo: order.invoice,

    dispatchDocumentNo: order.dispatchDocumentNo,

    transportMode: order.deliveryPartner,

    destination: order.shippingAddress,

    vehicleNumber: order.vehicleNumber,

    termsOfDelivery: order.termsOfDelivery,

    deliveredDate: order.deliveredDate

},

        });
        console.log("ORDER FROM API:", order);

console.log("STATE SHIPPING:", {
    transportMode: order.deliveryPartner,
    vehicleNumber: order.vehicleNumber
});

    }

    catch(err){

        console.log(err);

    }

};

  if (!state || !state.items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          No Invoice Data Found
        </h1>
      </div>
    );
  }

  const {
    items,
    subtotal,
    gstTotal,
    grandTotal,

    merchantName,
    merchantGST,

    merchantAddress,
    merchantState,
    merchantPlaceOfSupply,
    merchantContactPerson,
    merchantMobile,

    discountPercent = 0,
    discountAmount = 0,
    taxableAfterDiscount = subtotal,

    shippingDetails,
  } = state;

  console.log("Shipping Details in State:", shippingDetails);
  const isKarnataka =
    merchantState?.toLowerCase() ===
    "karnataka";

  const cgst =
    isKarnataka
      ? gstTotal / 2
      : 0;

  const sgst =
    isKarnataka
      ? gstTotal / 2
      : 0;


  const igst =
    isKarnataka
      ? 0
      : gstTotal;

const invoiceNo = state.invoiceNo;
  const today =
    new Date(state.invoiceDate).toLocaleDateString("en-IN");
  console.log("Items before PDF:", items);
  const invoiceData = {
    invoiceNo,
    date: today,
    items,
    subtotal,
    gstTotal,
    grandTotal,
    merchantName,
    merchantGST,

    merchantAddress,
    merchantState,
    merchantPlaceOfSupply,
    merchantContactPerson,
    merchantMobile,

    shippingDetails,

    discountPercent,
    discountAmount,
    taxableAfterDiscount,
  };

  const amountInWords =
    "Rupees " +
    toWords(Math.round(grandTotal)) +
    " Only";

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div
        id="invoice-content"
        className="max-w-7xl mx-auto bg-white shadow rounded-lg p-8"
    >

        {/* HEADER */}

        <div className="border-b pb-6">

          <div className="text-center">

            <div className="flex justify-between mb-4">

              <h2 className="font-bold text-lg">
                GST TAX INVOICE
              </h2>

              <h2 className="font-bold text-lg">
                ORIGINAL FOR RECIPIENT
              </h2>

            </div>

            <div className="flex items-center justify-center gap-5">

              <img
                src={logo}
                alt="Lasya Logo"
                className="w-20 h-20 rounded-full object-cover border shadow"
              />

              <div>

                <h1 className="text-4xl font-bold">
                  LASYA ENTERPRISES
                </h1>

                <p className="text-gray-600 text-lg">
                  Food Packing Items
                </p>

              </div>

            </div>

            <h2 className="text-3xl font-semibold mt-6">
              GST PROFORMA INVOICE
            </h2>

          </div>

        </div>

        {/* GST HEADER SECTION */}

        <div className="border mt-8">

          <div className="grid grid-cols-2 divide-t divide-black">

            {/* SELLER */}

            <div className="border-r p-5">

              <h3 className="font-bold text-lg mb-3">
                LASYA ENTERPRISES
              </h3>

              <p>Ward No.11</p>

              <p>
                Khata No.007/4230
              </p>

              <p>
                Melekote Gangasandra
              </p>

              <p>
                Tumakuru - 572102
              </p>

              <p>
                Karnataka, India
              </p>

              <br />

              <p>
                GSTIN/UIN :
                29CIGPD0689G1Z4
              </p>

              <p>
                PAN :
                CIGPD0689G
              </p>

              <p>
                State :
                Karnataka
              </p>

              <p>
                State Code :
                29
              </p>

              <p>
                Place Of Supply :
                Karnataka
              </p>

            </div>

            {/* INVOICE DETAILS */}

            <table className="w-full h-full border-collapse">

              <tbody>

                <tr>
                  <td className="border-b border-r p-3 font-medium">
                    Invoice No.
                  </td>

                  <td className="border-b p-3">
                    {invoiceNo}
                  </td>
                </tr>

                <tr>
                  <td className="border-b border-r p-3 font-medium">
                    Date
                  </td>

                  <td className="border-b p-3">
                    {today}
                  </td>
                </tr>

                <tr>
                  <td className="border-b border-r p-3 font-medium">
                    Delivery Note
                  </td>

                  <td className="border-b p-3">
                    {shippingDetails?.deliveryNote || "-"}
                  </td>
                </tr>

                <tr>
                  <td className="border-b border-r p-3 font-medium">
                    Supplier Ref.
                  </td>

                  <td className="border-b p-3">
                    {shippingDetails?.supplierRef || "-"}
                  </td>
                </tr>

                <tr>
                  <td className="border-r p-3 font-medium">
                    Other Reference
                  </td>

                  <td className="p-3">
                    {shippingDetails?.otherReference || "-"}
                  </td>
                </tr>

              </tbody>

            </table>
          </div>
        </div>
        {/* BUYER + SHIPPING */}

        <div className="border border-black mt-6">

          <div className="grid grid-cols-2">

            {/* BUYER */}

            <div className="border-r border-black h-full">

              <div className="border-b border-black p-3 font-bold text-lg bg-gray-50">
                Buyer Details
              </div>

              <div className="p-8 text-base leading-6">
              <p>
                <strong>Name :</strong>
                {" "}
                {merchantName}
              </p>

              <p>
                <strong>Address :</strong>
                {" "}
                {merchantAddress}
              </p>

            

              <p>
                <strong>GSTIN/UIN :</strong>
                {" "}
                {merchantGST}
              </p>

              <p>
                <strong>State Name :</strong>
                {" "}
                {merchantState}
              </p>

              <p>
                <strong>Place Of Supply :</strong>
                {" "}
                {merchantPlaceOfSupply}
              </p>

              <p>
                <strong>Contact Person :</strong>
                {" "}
                {merchantContactPerson}
              </p>

              <p>
                <strong>Mobile :</strong>
                {" "}
                {merchantMobile}
              </p>
              </div>

            </div>

            {/* SHIPPING */}

            <div>

              <div className="border-b border-black p-3 font-bold text-lg bg-gray-50">
                Shipping Details
              </div>

              <table className="w-full border-collapse text-sm">

                <tbody>

                  <tr>
                    <td className="border-b border-r p-3 font-medium">
                      Buyer's Order No
                    </td>

                    <td className="border-b p-3">
                      {shippingDetails?.buyersOrderNo}
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-r p-3 font-medium">
                      Dispatch Document No
                    </td>

                    <td className="border-b p-3">
                      {shippingDetails?.dispatchDocumentNo}
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-r p-3 font-medium">
                      Dispatched Through
                    </td>

                    <td className="border-b p-3">
                      {shippingDetails?.transportMode}
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-r p-3 font-medium">
                      Destination
                    </td>

                    <td className="border-b p-3">
                      {shippingDetails?.destination}
                    </td>
                  </tr>

                  

                  <tr>
    <td className="border-b border-r p-3 font-medium">
        Vehicle Number
    </td>

    <td className="border-b p-3">
        {shippingDetails?.vehicleNumber}
    </td>
</tr>

{/* 👇 PASTE HERE */}



{/* END */}



                  <tr>
                    <td className="border-r p-3 font-medium">
                      Terms Of Delivery
                    </td>

                    <td className="p-3">
                      {shippingDetails?.termsOfDelivery}
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* PRODUCT TABLE */}

        <div className="mt-8 overflow-x-auto">

          <table className="w-full border border-collapse">

            <thead>

              <tr className="bg-gray-100">

                <th className="border p-3">
                  Sl No
                </th>

                <th className="border p-3">
                  Description
                </th>

                <th className="border p-3">
                  HSN/SAC
                </th>

                <th className="border p-3">
                  Tax
                </th>

                <th className="border p-3">
                  Qty
                </th>

                <th className="border p-3">
                  Rate
                </th>

                <th className="border p-3">
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item, index) => {

                const amount =
                  item.quantity *
                  item.rate;

                return (

                  <tr key={index}>

                    <td className="border p-3 text-center">
                      {index + 1}
                    </td>

                    <td className="border p-3">
                      {item.product}
                    </td>

                    <td className="border p-3 text-center">
    {
        {
            "Foil Container": "7615",
            "Foil Roll": "7607",
            "Wooden Spoon": "4419",
            "Toothpick": "4421",
            "Dustbin Cover Small": "3923",
            "Dustbin Cover Medium": "3923",
            "Dustbin Cover Large": "3923"
        }[item.product] || "-"
    }
</td>

                    <td className="border p-3 text-center">

                      {isKarnataka
                        ? `CGST ${item.gst / 2}% + SGST ${item.gst / 2}%`
                        : `IGST ${item.gst}%`
                      }

                    </td>

                    <td className="border p-3 text-center">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="border p-3 text-center">
                      ₹{item.rate}
                    </td>

                    <td className="border p-3 text-center">
                      ₹{amount}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

        {/* TOTALS */}

        <div className="flex justify-end mt-8">

          <div className="w-96 border-2 border-black p-5">

            <div className="flex justify-between mb-3">
              <span>Taxable Value</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (

              <>
                <div className="flex justify-between mb-3 text-red-600">

                  <span>
                    Discount ({discountPercent}%)
                  </span>

                  <span>
                    -₹{discountAmount.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between mb-3">

                  <span>
                    Net Taxable Value
                  </span>

                  <span>
                    ₹{taxableAfterDiscount.toFixed(2)}
                  </span>

                </div>
              </>

            )}

            {isKarnataka ? (

              <>
                <div className="flex justify-between mb-3">

                  <span>CGST</span>

                  <span>
                    ₹{cgst.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between mb-3">

                  <span>SGST</span>

                  <span>
                    ₹{sgst.toFixed(2)}
                  </span>

                </div>
              </>

            ) : (

              <div className="flex justify-between mb-3">

                <span>IGST</span>

                <span>
                  ₹{igst.toFixed(2)}
                </span>

              </div>

            )}

            <hr />

            <div className="flex justify-between mt-3 text-xl font-bold">

              <span>
                Grand Total
              </span>

              <span>
                ₹{grandTotal.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

        <div className="border mt-4 p-4">

          <h3 className="font-semibold mb-2">
            Amount In Words
          </h3>

          <p className="text-lg capitalize">
    {amountInWords}
</p>

        </div>

        {/* DECLARATION */}

        <div className="mt-12 border rounded-lg p-5">

          <h3 className="font-bold mb-3">
            Declaration
          </h3>

          <p className="text-gray-600">
            We declare that this invoice
            shows the actual price of goods
            described herein and that all
            particulars are true and correct.
          </p>

        </div>

        {/* SIGNATURE */}

        <div className="flex justify-end mt-12">

          <div className="text-center">

            <p className="font-semibold">
              For LASYA ENTERPRISES
            </p>

            <div className="h-24"></div>

            <p>
              Authorised Signatory
            </p>

          </div>

        </div>
        {/* DOWNLOAD */}

        <div className="mt-10 print:hidden">

          <button
    onClick={() => {

        console.log("PDF DATA", invoiceData);

        console.log(
            "PDF SHIPPING",
            invoiceData.shippingDetails
        );

        generateInvoicePDF(invoiceData);

    }}

    className="bg-red-600 text-white px-6 py-3 rounded"

>

Download Invoice PDF

</button>

        </div>

      </div>
    </div>
  );
}
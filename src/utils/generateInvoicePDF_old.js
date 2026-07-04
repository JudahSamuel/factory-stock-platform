import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words";

export const generateInvoicePDF = (data) => {

  const {
    invoiceNo,
    date,

    merchantName,
    merchantGST,

    items,

    subtotal,
    gstTotal,
    grandTotal,
  } = data;

  const doc = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const cgst =
    gstTotal / 2;

  const sgst =
    gstTotal / 2;

  const amountInWords =
    "INR " +
    toWords(
      Math.round(
        grandTotal
      )
    ).toUpperCase() +
    " ONLY";

  // ==========================
  // TITLE
  // ==========================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(18);

  doc.text(
    "PROFORMA INVOICE",
    70,
    15
  );

  // ==========================
  // SELLER BLOCK
  // ==========================

  doc.rect(
    10,
    20,
    120,
    50
  );

  doc.setFontSize(11);

  doc.text(
    "LASYA ENTERPRISES",
    13,
    28
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Ward No 11",
    13,
    36
  );

  doc.text(
    "Melekote Post",
    13,
    42
  );

  doc.text(
    "Tumakuru",
    13,
    48
  );

  doc.text(
    "Karnataka",
    13,
    54
  );

  doc.text(
    "GSTIN : 29XXXXXXXXXXXX",
    13,
    62
  );

  // ==========================
  // INVOICE DETAILS
  // ==========================

  doc.rect(
    130,
    20,
    70,
    50
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Invoice No",
    135,
    32
  );

  doc.text(
    invoiceNo,
    165,
    32
  );

  doc.text(
    "Date",
    135,
    45
  );

  doc.text(
    date,
    165,
    45
  );

  // ==========================
  // BUYER DETAILS
  // ==========================

  doc.rect(
    10,
    70,
    190,
    35
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Buyer Details",
    13,
    80
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    merchantName,
    13,
    92
  );

  doc.text(
    `GSTIN : ${merchantGST}`,
    13,
    100
  );

  // ==========================
  // PRODUCT TABLE
  // ==========================

  autoTable(doc, {
    startY: 115,

    head: [[
      "Sl No",
      "Description",
      "HSN/SAC",
      "GST %",
      "Qty",
      "Rate",
      "Amount",
    ]],

    body: items.map(
      (
        item,
        index
      ) => [

        index + 1,

        item.product,

        item.hsn,

        `${item.gstRate}%`,

        `${item.quantity} ${item.unit}`,

        `₹${item.rate}`,

        `₹${
          item.quantity *
          item.rate
        }`,
      ]
    ),

    styles: {
      fontSize: 10,
      halign: "center",
    },

    headStyles: {
      fillColor: [
        52,
        115,
        168,
      ],
    },
  });

  const tableEndY =
    doc.lastAutoTable.finalY;

  let currentY =
    tableEndY;

  // ==========================
  // TOTAL BOX
  // ==========================

  doc.rect(
    120,
    tableEndY + 10,
    80,
    50
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Taxable Value : ₹${subtotal.toFixed(
      2
    )}`,
    125,
    tableEndY + 20
  );

  doc.text(
    `CGST : ₹${cgst.toFixed(
      2
    )}`,
    125,
    tableEndY + 30
  );

  doc.text(
    `SGST : ₹${sgst.toFixed(
      2
    )}`,
    125,
    tableEndY + 40
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    `Grand Total : ₹${grandTotal.toFixed(
      2
    )}`,
    125,
    tableEndY + 52
  );

  // ==========================
  // AMOUNT IN WORDS
  // ==========================
  currentY += 15;

    if (currentY > 210) {
    doc.addPage();
    currentY = 20;
    }

    doc.rect(
    10,
    currentY,
    190,
    20
    );

  doc.rect(
    10,
    tableEndY + 70,
    190,
    20
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Amount Chargeable (in words)",
    13,
    tableEndY + 78
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    amountInWords,
    13,
    tableEndY + 86
  );

  // ==========================
  // DECLARATION
  // ==========================

  doc.rect(
    10,
    tableEndY + 95,
    190,
    45
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Declaration",
    13,
    tableEndY + 105
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "We declare that this invoice shows",
    13,
    tableEndY + 115
  );

  doc.text(
    "the actual price of goods described",
    13,
    tableEndY + 122
  );

  doc.text(
    "and all particulars are true and correct.",
    13,
    tableEndY + 129
  );

  // ==========================
  // SIGNATURE
  // ==========================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "For Lasya Enterprises",
    140,
    tableEndY + 115
  );

  doc.text(
    "Authorised Signatory",
    140,
    tableEndY + 132
  );

  // ==========================
  // FOOTER
  // ==========================

  doc.setFontSize(9);

  doc.setFont(
    "helvetica",
    "italic"
  );

  doc.text(
    "This is a Computer Generated Invoice",
    65,
    285
  );

  // ==========================
  // SAVE
  // ==========================

  doc.save(
    `${invoiceNo}.pdf`
  );

};















import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words";
import signature from "../assets/signature.png";
import logo from "../assets/lasya-logo.jpeg";

export const generateInvoicePDF = (data) => {
    console.log("FULL DATA:", data);


  const {
    invoiceNo,
    date,

    merchantName,
    merchantGST,

    merchantAddress,
    merchantState,
    merchantPlaceOfSupply,
    merchantContactPerson,
    merchantMobile,

    shippingDetails,

    items,
    subtotal,
    gstTotal,
    grandTotal,

    discountPercent = 0,
    discountAmount = 0,
    taxableAfterDiscount,
  } = data;
    console.log("Shipping Details:", shippingDetails);


  const finalTaxable =
    taxableAfterDiscount ??
    subtotal;

  const doc = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const cgst =
    gstTotal / 2;

  const sgst =
    gstTotal / 2;

  const amountInWords =
    "INR " +
    toWords(
      Math.round(
        Number(grandTotal)
      )
    ).toUpperCase() +
    " ONLY";

  // ==========================
  // TITLE
  // ==========================

  doc.setFontSize(11);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "GST TAX INVOICE",
  85,
  8
);

doc.setFontSize(8);

doc.setFont(
  "helvetica",
  "italic"
);

doc.text(
  "(ORIGINAL FOR RECIPIENT)",
  155,
  8
);

doc.setFontSize(18);

doc.setFont(
  "helvetica",
  "bold"
);

doc.setFontSize(14);
doc.text(
  "PROFORMA INVOICE",
  75,
  18
);

doc.addImage(
  logo,
  "JPEG",
  15,
  8,
  16,
  16
);
  autoTable(doc,{
  startY:28,

  theme: "grid",

  styles: {
  fontSize: 8,
  cellPadding: 1.5,
  lineWidth: 0.2,
  lineColor: [0,0,0],
  valign: "middle",
},

  columnStyles:{
  0:{cellWidth:110},
  1:{cellWidth:35},
  2:{cellWidth:35}
},

  body:[
    [
      {
        content:
`LASYA ENTERPRISES
Ward No.11
Khata No.007/4230
Melekote Gangasandra
Tumakuru - 572102
Karnataka
GSTIN : 29CIGPD0689G1Z4`,
        rowSpan:3,
        styles:{
    fontStyle:"bold"
  }
      },
       "Invoice No.",
  {
    content: invoiceNo,
    styles: {
      fontStyle: "bold"
    }
  }
    ],
    [
      "Date",
  {
    content: date,
    styles: {
      fontStyle: "bold"
    }
  }
    ],
    [
      "Delivery Note",
      {
        content: shippingDetails?.deliveryNote || "-",
        styles: {
          fontStyle: "bold"
        }
      }
    ]
  ]
})

console.log("Shipping Details:", shippingDetails);
console.log(
  "Terms Of Delivery:",
  shippingDetails?.termsOfDelivery
);

autoTable(doc,{
  startY: doc.lastAutoTable.finalY,

  theme:"grid",

  styles:{
    fontSize:8,
    cellPadding:1.5,
    lineWidth:0.2,
    lineColor:[0,0,0],
    valign:"middle",
  },

  columnStyles:{
    0:{cellWidth:110},
    1:{cellWidth:35},
    2:{cellWidth:35},
  },

  body:[

    [
      {
        content:
`Buyer Details
${merchantName}
${merchantAddress}
GSTIN : ${merchantGST}
State : ${merchantState}
Place : ${merchantPlaceOfSupply}
Contact : ${merchantContactPerson}
Mobile : ${merchantMobile}`,
        rowSpan:6,
        styles:{
          fontStyle:"bold"
        }
      },

      "Buyer's Order No",
      {
        content:
          shippingDetails?.buyersOrderNo || "-",
        styles:{
          fontStyle:"bold"
        }
      }
    ],

    [
      "Dispatch Document No",
      {
        content:
          shippingDetails?.dispatchDocumentNo || "-",
        styles:{
          fontStyle:"bold"
        }
      }
    ],

    [
      "Dispatched Through",
      {
        content:
          shippingDetails?.transportMode || "-",
        styles:{
          fontStyle:"bold"
        }
      }
    ],

    [
      "Destination",
      {
        content:
          shippingDetails?.destination || "-",
        styles:{
          fontStyle:"bold"
        }
      }
    ],

    [
      "Vehicle Number",
      {
        content:
          shippingDetails?.vehicleNumber || "-",
        styles:{
          fontStyle:"bold"
        }
      }
    ],

    [
      "Terms Of Delivery",
      {
        content:
          shippingDetails?.termsOfDelivery || "-",
        styles:{
          fontStyle:"bold"
        }
      }
    ]

  ]
});

  // ==========================
// PRODUCT TABLE
// ==========================

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 5,

  head: [[
    "Sl No",
    "Description of Goods",
    "HSN/SAC",
    "Quantity",
    "Rate",
    "Per",
    "Disc %",
    "Amount",
  ]],

  body: items.map((item,index)=>[

  index + 1,

  item.product,

  item.hsn || "-",

  item.quantity,

  Number(item.rate).toFixed(2),

  item.unit || "Nos",

  item.discountPercent || 0,

  (
    item.quantity *
    item.rate *
    (1 - (item.discountPercent || 0)/100)
  ).toFixed(2)

]),

  styles: {
  fontSize: 7,
  cellPadding: 2,
  halign: "center",
  valign: "middle",

  lineWidth: 0.2,
  lineColor: [0,0,0]
},

  headStyles:{
  fillColor:[255,255,255],
  textColor:[0,0,0],
  lineWidth:0.2,
  lineColor:[0,0,0],
  fontStyle:"bold",
  halign:"center"
},

columnStyles:{
  0:{cellWidth:12},
  1:{cellWidth:55},
  2:{cellWidth:22},
  3:{cellWidth:18},
  4:{cellWidth:18},
  5:{cellWidth:12},
  6:{cellWidth:15},
  7:{cellWidth:28}
}
});



const tableEndY =
  doc.lastAutoTable.finalY;

const gstRate =
  items[0]?.gstRate || 18;

const halfRate =
  gstRate / 2;

const totalQty =
  items.reduce(
    (sum,item)=>
      sum + Number(item.quantity),
    0
  );

const unit =
  items[0]?.unit || "Nos";

autoTable(doc,{
  startY: tableEndY,

  theme:"grid",

  styles:{
    fontSize:8,
    cellPadding:2,
    lineWidth:0.2,
    lineColor:[0,0,0],
    halign:"center",
    valign:"middle"
  },

  columnStyles:{
  0:{cellWidth:104},
  1:{cellWidth:18},
  2:{cellWidth:18},
  3:{cellWidth:15},
  4:{cellWidth:25}
},

  body:[

  [
  {
    content:"Output CGST",
    colSpan:3
  },
  {
    content:`${halfRate}%`
  },
  {
    content:cgst.toFixed(2)
  }
],

[
  {
    content:"Output SGST",
    colSpan:3
  },
  {
    content:`${halfRate}%`
  },
  {
    content:sgst.toFixed(2)
  }
],

  [
    {
      content:"Total",
      styles:{
        fontStyle:"bold"
      }
    },

    "",

    {
      content:`${totalQty} ${unit}`,
      styles:{
        fontStyle:"bold"
      }
    },

    "",

    {
      content:grandTotal.toFixed(2),
      styles:{
        fontStyle:"bold"
      }
    }
  ]
]
});

const wordsY =
  doc.lastAutoTable.finalY + 8;

doc.rect(
  10,
  wordsY,
  190,
  15
);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Amount Chargeable (in words)",
  13,
  wordsY + 6
);

doc.setFont(
  "helvetica",
  "normal"
);

doc.setFontSize(8);

doc.text(
  amountInWords,
  13,
  wordsY + 12
);

  

  // ==========================
// DECLARATION
// ==========================

const declarationY =
  wordsY + 20;

doc.rect(
  10,
  declarationY,
  120,
  25
);

doc.setFontSize(8);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Declaration",
  13,
  declarationY + 6
);

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  "We declare that this invoice shows the",
  13,
  declarationY + 12
);

doc.text(
  "actual price of goods described herein",
  13,
  declarationY + 17
);

doc.text(
  "and all particulars are true and correct.",
  13,
  declarationY + 22
);

// ==========================
// SIGNATURE BOX
// ==========================

doc.rect(
  130,
  declarationY,
  70,
  25
);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "For Lasya Enterprises",
  138,
  declarationY + 8
);

// Signature Image

doc.addImage(
  signature,
  "PNG",
  140,
  declarationY + 10,
  40,
  12
);

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  "Authorised Signatory",
  142,
  declarationY + 23
);

// ==========================
// FOOTER
// ==========================





doc.setFontSize(8);

doc.setFont(
  "helvetica",
  "italic"
);

doc.text(
  "This is a Computer Generated Invoice",
  65,
  285
);

doc.save(
  `${invoiceNo}.pdf`
);

};



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
































import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function MerchantDashboard() {

  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "inventory"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInventory(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleQuantityChange = (
    product,
    value
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [product]: value,
    }));
  };

  const createOrder = async (item) => {
  const quantity =
    Number(quantities[item.product]) || 1;

  const rate =
    Number(item.price) || 0;

  const subtotal =
    quantity * rate;

  const gst = Number(
    (subtotal * 0.18).toFixed(2)
  );

  const grandTotal = Number(
    (subtotal + gst).toFixed(2)
  );

  try {

    await addDoc(
      collection(db, "orders"),
      {
        merchantName:
          "Patel Commercial",

        merchantGST:
          "29ABCDE1234F1Z5",

        product:
          item.product,

        quantity:
          quantity,

        rate:
          rate,

        subtotal:
          subtotal,

        gst:
          gst,

        grandTotal:
          grandTotal,

        status:
          "Pending",

        createdAt:
          new Date().toISOString(),
      }
    );

    alert(
      `Order Created

Subtotal : ₹${subtotal}
GST : ₹${gst}
Grand Total : ₹${grandTotal}`
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to create order"
    );

  }
};

  const filteredInventory = inventory.filter(
    (item) =>
      item.product
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (sum, item) => sum + (item.stock || 0),
    0
  );

  const inventoryValue = inventory.reduce(
    (sum, item) =>
      sum +
      ((item.stock || 0) *
        (item.price || 0)),
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Merchant Dashboard
      </h1>

      <div className="flex gap-3 mb-6">

        <button
          onClick={() =>
            navigate("/my-orders")
          }
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          My Orders
        </button>

      </div>

      {/* Analytics */}

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-blue-600 text-white p-5 rounded-xl shadow">
          <h3>Total Products</h3>
          <p className="text-3xl font-bold">
            {totalProducts}
          </p>
        </div>

        <div className="bg-green-600 text-white p-5 rounded-xl shadow">
          <h3>Total Stock</h3>
          <p className="text-3xl font-bold">
            {totalStock}
          </p>
        </div>

        <div className="bg-purple-600 text-white p-5 rounded-xl shadow">
          <h3>Inventory Value</h3>
          <p className="text-3xl font-bold">
            ₹{inventoryValue}
          </p>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border p-3 rounded-lg"
        />

      </div>

      {/* Inventory Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Unit
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredInventory.length > 0 ? (

              filteredInventory.map((item) => (

                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {item.product}
                  </td>

                  <td className="p-4">
                    {item.category}
                  </td>

                  <td className="p-4">
                    {item.stock}
                  </td>

                  <td className="p-4">
                    {item.unit}
                  </td>

                  <td className="p-4">
                    ₹{item.price}
                  </td>

                  <td className="p-4">

                    <input
                      type="number"
                      min="0"
                      max={item.stock}
                      value={
                        quantities[item.product] || 0
                      }
                      onChange={(e) => {

                        const value =
                          Number(e.target.value);

                        if (
                          value >
                          Number(item.stock)
                        ) {

                          alert(
                            `Maximum available stock is ${item.stock}`
                          );

                          return;
                        }

                        handleQuantityChange(
                          item.product,
                          value
                        );
                      }}
                      className="border p-2 rounded w-24"
                    />

                  </td>

                  <td className="p-4">

                    {item.stock > 0 ? (

                      <span className="text-green-600 font-semibold">
                        Available
                      </span>

                    ) : (

                      <span className="text-red-600 font-semibold">
                        Out of Stock
                      </span>

                    )}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-6"
                >
                  No products found
                </td>

              </tr>

            )}

          </tbody>

        </table>
        <div className="p-6 border-t bg-gray-50 flex justify-end">

          <button
            onClick={() => {

              const selectedItems =
                inventory
                  .filter(item => {

                    const qty =
                      Number(
                        quantities[item.product]
                      ) || 0;

                    return qty > 0;
                  })
                  .map(item => ({
                    product: item.product,
                    quantity:
                      Number(
                        quantities[item.product]
                      ),

                    rate:
                      item.price,

                    gstRate:
                      item.gst,

                    hsn:
                      item.hsn,

                    unit:
                      item.unit,
                  }));
              for (const item of selectedItems) {

                const inventoryItem =
                  inventory.find(
                    (inv) =>
                      inv.product === item.product
                  );

                if (
                  item.quantity >
                  Number(inventoryItem.stock)
                ) {

                  alert(
                    `Insufficient Stock!

              Product : ${item.product}

              Available : ${inventoryItem.stock} ${inventoryItem.unit}

              Requested : ${item.quantity} ${inventoryItem.unit}`
                  );

                  return;
                }
              }

              if (
                selectedItems.length === 0
              ) {

                alert(
                  "Please select at least one product"
                );

                return;
              }

              navigate(
                "/checkout",
                {
                  state: {
                    items:
                      selectedItems,
                  },
                }
              );

            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Checkout Selected Items
          </button> 

        </div>

      </div>

    </div>
  );
}
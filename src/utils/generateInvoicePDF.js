import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words";
import signature from "../assets/signature.png";
import logo from "../assets/lasya-logo.jpeg";
import stamp from "../assets/stamp.jpg";
const HSN_MAP = {
    "Foil Container": "7615",
    "Foil Roll": "7607",
    "Wooden Spoon": "4419",
    "Toothpick": "4421",
    "Dustbin Cover Small": "3923",
    "Dustbin Cover Medium": "3923",
    "Dustbin Cover Large": "3923"
};

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

  const stampImg = new Image();

stampImg.src = stamp;

  const isIntraState =
  merchantState
    ?.toLowerCase()
    .includes("karnataka");

let cgst = 0;
let sgst = 0;
let igst = 0;

if(isIntraState){
  cgst = gstTotal / 2;
  sgst = gstTotal / 2;
}else{
  igst = gstTotal;
}

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
doc.setFontSize(8);

doc.text(
  isIntraState
    ? "INTRA STATE SUPPLY (CGST + SGST)"
    : "INTER STATE SUPPLY (IGST)",
  75,
  23
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

console.log("deliveryNote =", shippingDetails?.deliveryNote);
console.log("buyersOrderNo =", shippingDetails?.buyersOrderNo);
console.log("dispatchDocumentNo =", shippingDetails?.dispatchDocumentNo);
console.log("transportMode =", shippingDetails?.transportMode);
console.log("destination =", shippingDetails?.destination);
console.log("vehicleNumber =", shippingDetails?.vehicleNumber);
console.log("termsOfDelivery =", shippingDetails?.termsOfDelivery);
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
  {
    content:
      `Terms Of Delivery : ${shippingDetails?.termsOfDelivery || "-"}`,
    colSpan:3,
    styles:{
      fontStyle:"bold",
      halign:"left"
    }
  }
]

  ]
});

  // ==========================
// PRODUCT TABLE
// ==========================
console.log(JSON.stringify(items, null, 2));
autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 5,

  margin: {
  left: 14,
  right: 25
},
tableWidth: 190,

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

  HSN_MAP[item.product] || "-",

  item.quantity,

  Number(item.rate).toFixed(2),

  item.unit || "Nos",

  discountPercent || 0,

  (
    item.quantity *
    item.rate *
    (1 - (discountPercent || 0)/100)
  ).toFixed(2)

]),

  styles: {
  fontSize: 8,
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
  0:{cellWidth:10},
  1:{cellWidth:50},
  2:{cellWidth:18},
  3:{cellWidth:18},
  4:{cellWidth:27},
  5:{cellWidth:15},
  6:{cellWidth:17},
  7:{cellWidth:25}
}
});



const tableEndY =
  doc.lastAutoTable.finalY;

const gstBreakup = {};

items.forEach(item => {

  const taxable =
  Number(item.quantity) *
  Number(item.rate) *
  (1 - Number(discountPercent || 0) / 100);

  const gstRate =
    Number(item.gst || 0);

  if(!gstBreakup[gstRate]){
    gstBreakup[gstRate] = {
      taxable:0,
      gst:0
    };
  }

  gstBreakup[gstRate].taxable += taxable;

  gstBreakup[gstRate].gst +=
    taxable * gstRate / 100;
});

const totalQty =
  items.reduce(
    (sum,item)=>
      sum + Number(item.quantity),
    0
  );


const gstRows = [];

Object.keys(gstBreakup).forEach(rate => {

  const gstAmount =
    gstBreakup[rate].gst;

  if(isIntraState){

    gstRows.push([
      `Output CGST ${rate/2}%`,
      "",
      "",
      (gstAmount/2).toFixed(2)
    ]);

    gstRows.push([
      `Output SGST ${rate/2}%`,
      "",
      "",
      (gstAmount/2).toFixed(2)
    ]);

  }else{

    gstRows.push([
      `Output IGST ${rate}%`,
      "",
      "",
      gstAmount.toFixed(2)
    ]);

  }

});

gstRows.push([
  {
    content:"Total",
    styles:{
      fontStyle:"bold"
    }
  },

  {
    content:`${totalQty}`,
    styles:{
      fontStyle:"bold"
    }
  },

  {
    content:"Items",
    styles:{
      fontStyle:"bold"
    }
  },

  {
    content:grandTotal.toFixed(2),
    styles:{
      fontStyle:"bold"
    }
  }
]);

autoTable(doc,{
  startY: tableEndY,

  theme:"grid",

  margin:{
    left:14,
    right:25
  },

  tableWidth:160,

  styles:{
    fontSize:8,
    cellPadding:2,
    lineWidth:0.2,
    lineColor:[0,0,0],
    halign:"center",
    valign:"middle"
  },

  columnStyles:{
  0:{cellWidth:110},
  1:{cellWidth:22},
  2:{cellWidth:23},
  3:{cellWidth:25}
},

  body: gstRows
});

const wordsY =
  doc.lastAutoTable.finalY + 8;

doc.rect(
  14,
  wordsY,
  180,
  15
);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Amount Chargeable (in words)",
  18,
  wordsY + 6
);

doc.setFont(
  "helvetica",
  "normal"
);

doc.setFontSize(8);

doc.text(
  amountInWords,
  18,
  wordsY + 12
);

  

  // ==========================
// DECLARATION
// ==========================

const declarationY = 245;

const bankY = declarationY - 18;


doc.setFontSize(7);

doc.setFont("helvetica","bold");

doc.text(
  "Company's Bank Details",
  135,
  bankY
);

doc.setFont("helvetica","normal");

doc.text(
  "Bank Name : Canara Bank",
  135,
  bankY + 5
);

doc.text(
  "A/C No : 20071010001547",
  135,
  bankY + 8
);

doc.text(
  "IFSC : CNRB0012007",
  135,
  bankY + 11
);

doc.text(
  "Branch : TUMAKURU SIDDHARTHA INSTITUTE OF",
  135,
  bankY + 14
);

doc.text(
  "TECHNOLOGY",
  145,
  bankY + 17
);



doc.rect(
  14,
  declarationY,
  120,
  25
);

doc.setFontSize(7);

doc.text(
  "Company's PAN : CIGPD0689G",
  17,
  declarationY -3
);



doc.setFontSize(8);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Declaration",
  17,
  declarationY + 6
);

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  "We declare that this invoice shows the actual price",
  17,
  declarationY + 12
);

doc.text(
  "of the goods described and that all particulars",
  17,
  declarationY + 17
);

doc.text(
  "are true and correct.",
  17,
  declarationY + 22
);

// ==========================
// SIGNATURE + BANK DETAILS
// ==========================

doc.rect(
  124,
  declarationY,
  70,
  25
);

doc.setFontSize(7);

doc.setFont(
  "helvetica",
  "bold"
);

doc.addImage(
    stampImg,
    "PNG",
    95,
    247,
    21,
    21
);

// company name

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "For LASYA ENTERPRISES",
  147,
  declarationY + 5
);

doc.addImage(
  signature,
  "PNG",
  150,
  declarationY + 7,
  28,
  10
);

doc.text(
  "Authorised Signatory",
  152,
  declarationY + 20
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
  "SUBJECT TO TUMAKURU JURISDICTION",
  78,
  286
);

doc.text(
  "This is a Computer Generated Invoice",
  81,
  291
);



// ==========================
// SAVE PDF
// ==========================

doc.save(
    `Invoice_${merchantName}_${invoiceNo}.pdf`
);

};
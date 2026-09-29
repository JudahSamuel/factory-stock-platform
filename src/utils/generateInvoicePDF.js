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
  "Dustbin Cover Large": "3923",
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

    // Order Details
    deliveryNote,
    buyersOrderNo,
    remarks,

    // Dispatch Details
    supplierRef,
    dispatchDocumentNo,
    deliveryPartner,
    transporterName,
    vehicleNumber,
    destination,
    lrNumber,
    termsOfDelivery,

    items = [],

    discountPercent = 0,
  } = data;

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

  // ======================================================
  // MAXIMUM PRODUCTS PER PAGE
  // ======================================================

  const ITEMS_PER_PAGE = 5;

  const itemPages = [];

  for (
    let i = 0;
    i < items.length;
    i += ITEMS_PER_PAGE
  ) {
    itemPages.push(
      items.slice(
        i,
        i + ITEMS_PER_PAGE
      )
    );
  }

  // If there are no products,
  // still generate one invoice page.
  if (itemPages.length === 0) {
    itemPages.push([]);
  }

  const totalPages = itemPages.length;


  // ======================================================
  // CALCULATE TOTALS FOR ONE PAGE ONLY
  // ======================================================

  const calculatePageTotals = (pageItems) => {

    const gstBreakup = {};

    let subtotal = 0;
    let taxableAmount = 0;
    let totalQty = 0;

    pageItems.forEach((item) => {

      const quantity =
        Number(item.quantity) || 0;

      const rate =
        Number(item.rate) || 0;

      const gstRate =
        Number(
          item.gstRate ??
          item.gst ??
          0
        ) || 0;

      const rawAmount =
        quantity * rate;

      const discountedAmount =
        rawAmount *
        (
          1 -
          Number(discountPercent || 0) / 100
        );

      subtotal += rawAmount;

      taxableAmount +=
        discountedAmount;

      totalQty += quantity;


      if (!gstBreakup[gstRate]) {

        gstBreakup[gstRate] = {
          taxable: 0,
          gst: 0,
        };

      }


      gstBreakup[gstRate].taxable +=
        discountedAmount;


      gstBreakup[gstRate].gst +=
        discountedAmount *
        gstRate /
        100;

    });


    const gstTotal =
      Object.values(gstBreakup)
        .reduce(
          (sum, group) =>
            sum + group.gst,
          0
        );


    const grandTotal =
      taxableAmount +
      gstTotal;


    return {
      gstBreakup,
      subtotal,
      taxableAmount,
      gstTotal,
      grandTotal,
      totalQty,
    };

  };


  // ======================================================
  // DRAW HEADER
  // ======================================================

  const drawInvoiceHeader = (
    pageNumber,
    totalPages
  ) => {

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


    doc.setFontSize(14);

    doc.setFont(
      "helvetica",
      "bold"
    );

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


    // ==========================
    // PAGE CONTINUATION
    // ==========================

    if (pageNumber > 1) {

      doc.setFontSize(7);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `CONTINUED - PAGE ${pageNumber} OF ${totalPages}`,
        145,
        23
      );

    }


    // ======================================================
    // COMPANY + INVOICE DETAILS
    // ======================================================

    autoTable(doc, {

      startY: 28,

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 1.5,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: "middle",
      },

      columnStyles: {

        0: {
          cellWidth: 110
        },

        1: {
          cellWidth: 35
        },

        2: {
          cellWidth: 35
        },

      },


      body: [

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

            rowSpan: 3,

            styles: {
              fontStyle: "bold"
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
            content:
              deliveryNote || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ]

      ]

    });


    // ======================================================
    // BUYER + DISPATCH DETAILS
    // ======================================================

    autoTable(doc, {

      startY:
        doc.lastAutoTable.finalY,

      theme: "grid",

      styles: {

        fontSize: 8,

        cellPadding: 1.5,

        lineWidth: 0.2,

        lineColor: [
          0,
          0,
          0
        ],

        valign: "middle"

      },


      columnStyles: {

        0: {
          cellWidth: 110
        },

        1: {
          cellWidth: 35
        },

        2: {
          cellWidth: 35
        }

      },


      body: [

        [

          {

            content:
`Buyer Details
${merchantName || "-"}
${merchantAddress || "-"}
GSTIN : ${merchantGST || "-"}
State : ${merchantState || "-"}
Place : ${merchantPlaceOfSupply || "-"}
Contact : ${merchantContactPerson || "-"}
Mobile : ${merchantMobile || "-"}`,

            rowSpan: 10,

            styles: {
              fontStyle: "bold"
            }

          },


          "Buyer's Order No",


          {

            content:
              buyersOrderNo || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Supplier Reference",

          {

            content:
              supplierRef || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Transporter Name",

          {

            content:
              transporterName || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "LR Number",

          {

            content:
              lrNumber || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Remarks",

          {

            content:
              remarks || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Dispatch Document No",

          {

            content:
              dispatchDocumentNo || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Dispatched Through",

          {

            content:
              deliveryPartner || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Destination",

          {

            content:
              destination || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          "Vehicle Number",

          {

            content:
              vehicleNumber || "-",

            styles: {
              fontStyle: "bold"
            }

          }

        ],


        [

          {

            content:
              `Terms Of Delivery : ${termsOfDelivery || "-"}`,

            colSpan: 3,

            styles: {

              fontStyle: "bold",

              halign: "left"

            }

          }

        ]

      ]

    });

  };


  // ======================================================
  // PRODUCT + GST + TOTALS FOR ONE PAGE
  // ======================================================

  const drawProductAndTotals = (
    pageItems,
    calculations,
    pageNumber
  ) => {

    // ======================================================
    // PRODUCT TABLE
    // ======================================================

    console.log(
      `PAGE ${pageNumber} ITEMS:`,
      JSON.stringify(
        pageItems,
        null,
        2
      )
    );


    const productRows =
      pageItems.map(
        (item, index) => [

          // Continue serial numbers
          index +
            1 +
            (
              (pageNumber - 1) *
              ITEMS_PER_PAGE
            ),


          item.product,


          item.hsn ||
            HSN_MAP[
              item.product
            ] ||
            "-",


          item.quantity,


          Number(
            item.rate || 0
          ).toFixed(2),


          item.unit ||
            "Nos",


          discountPercent || 0,


          (

            Number(
              item.quantity || 0
            ) *

            Number(
              item.rate || 0
            ) *

            (
              1 -
              Number(
                discountPercent || 0
              ) / 100
            )

          ).toFixed(2)

        ]
      );


    autoTable(doc, {

      startY:
        doc.lastAutoTable.finalY + 5,


      margin: {

        left: 14,

        right: 16

      },


      tableWidth: 180,


      theme: "grid",


      head: [[

        "Sl No",

        "Description of Goods",

        "HSN/SAC",

        "Quantity",

        "Rate",

        "Per",

        "Disc %",

        "Amount"

      ]],


      body: productRows,


      styles: {

        fontSize: 8,

        cellPadding: 2,

        halign: "center",

        valign: "middle",

        lineWidth: 0.2,

        lineColor: [
          0,
          0,
          0
        ]

      },


      headStyles: {

        fillColor: [
          255,
          255,
          255
        ],

        textColor: [
          0,
          0,
          0
        ],

        lineWidth: 0.2,

        lineColor: [
          0,
          0,
          0
        ],

        fontStyle: "bold",

        halign: "center"

      },


      columnStyles: {

        0: {
          cellWidth: 10
        },

        1: {
          cellWidth: 50
        },

        2: {
          cellWidth: 18
        },

        3: {
          cellWidth: 18
        },

        4: {
          cellWidth: 27
        },

        5: {
          cellWidth: 15
        },

        6: {
          cellWidth: 17
        },

        7: {
          cellWidth: 25
        }

      }

    });


    const tableEndY =
      doc.lastAutoTable.finalY;


    // ======================================================
    // GST BREAKUP FOR THIS PAGE ONLY
    // ======================================================

    const gstRows = [];


    Object.keys(
      calculations.gstBreakup
    ).forEach(
      (rate) => {

        const gstAmount =
          calculations
            .gstBreakup[rate]
            .gst;


        if (isIntraState) {

          gstRows.push([

            `Output CGST ${Number(rate) / 2}%`,

            "",

            "",

            (
              gstAmount / 2
            ).toFixed(2)

          ]);


          gstRows.push([

            `Output SGST ${Number(rate) / 2}%`,

            "",

            "",

            (
              gstAmount / 2
            ).toFixed(2)

          ]);

        }


        else {

          gstRows.push([

            `Output IGST ${rate}%`,

            "",

            "",

            gstAmount.toFixed(2)

          ]);

        }

      }
    );


    // ======================================================
    // PAGE-SPECIFIC TOTAL
    // ======================================================

    gstRows.push([

      {

        content: "Total",

        styles: {
          fontStyle: "bold"
        }

      },


      {

        content:
          `${calculations.totalQty}`,

        styles: {
          fontStyle: "bold"
        }

      },


      {

        content: "Items",

        styles: {
          fontStyle: "bold"
        }

      },


      {

        content:
          calculations
            .grandTotal
            .toFixed(2),

        styles: {
          fontStyle: "bold"
        }

      }

    ]);


    // ======================================================
    // GST TABLE
    // ======================================================

    autoTable(doc, {

      startY: tableEndY,


      theme: "grid",


      margin: {

        left: 14,

        right: 16

      },


      tableWidth: 180,


      styles: {

        fontSize: 8,

        cellPadding: 2,

        lineWidth: 0.2,

        lineColor: [
          0,
          0,
          0
        ],

        halign: "center",

        valign: "middle"

      },


      columnStyles: {

        0: {
          cellWidth: 110
        },

        1: {
          cellWidth: 20
        },

        2: {
          cellWidth: 20
        },

        3: {
          cellWidth: 30
        }

      },


      body: gstRows

    });


    // ======================================================
    // AMOUNT IN WORDS
    // ======================================================

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


    doc.setFontSize(7);


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


    const pageAmountInWords =

      "INR " +

      toWords(

        Math.round(

          calculations
            .grandTotal

        )

      )

      .toUpperCase() +

      " ONLY";


    doc.text(

      pageAmountInWords,

      18,

      wordsY + 12

    );


    // ======================================================
    // FIXED BOTTOM SECTION
    // ======================================================

    const declarationY = 245;

    const bankY =
      declarationY - 18;


    // ======================================================
    // BANK DETAILS
    // ======================================================

    doc.setFontSize(7);

    doc.setFont(

      "helvetica",

      "bold"

    );


    doc.text(

      "Company's Bank Details",

      135,

      bankY

    );


    doc.setFont(

      "helvetica",

      "normal"

    );


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


    // ======================================================
    // DECLARATION
    // ======================================================

    doc.rect(

      14,

      declarationY,

      120,

      25

    );


    doc.setFontSize(7);

    doc.setFont(

      "helvetica",

      "bold"

    );


    doc.text(

      "Company's PAN : CIGPD0689G",

      17,

      declarationY - 3

    );


    doc.setFontSize(8);


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


    // ======================================================
    // SIGNATURE
    // ======================================================

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


    // ======================================================
    // FOOTER
    // ======================================================

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


    // Page number only when
    // multiple pages exist.

    if (totalPages > 1) {

      doc.setFont(

        "helvetica",

        "normal"

      );

      doc.setFontSize(7);


      doc.text(

        `Page ${pageNumber} of ${totalPages}`,

        176,

        297

      );

    }

  };


  // ======================================================
  // GENERATE EACH PAGE
  // ======================================================

  itemPages.forEach(

    (pageItems, pageIndex) => {

      const pageNumber =
        pageIndex + 1;


      // First page already exists.
      // Every additional page gets added.

      if (pageNumber > 1) {

        doc.addPage();

      }


      // Calculate ONLY this page's items.

      const calculations =
        calculatePageTotals(
          pageItems
        );


      console.log(
        `PAGE ${pageNumber} CALCULATIONS:`,
        calculations
      );


      // Draw the same invoice
      // structure on every page.

      drawInvoiceHeader(

        pageNumber,

        totalPages

      );


      drawProductAndTotals(

        pageItems,

        calculations,

        pageNumber

      );

    }

  );


  // ======================================================
  // SAVE
  // ======================================================

  doc.save(

    `Invoice_${merchantName}_${invoiceNo}.pdf`

  );

};
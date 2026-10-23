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

  // 1. PDF Page Size: A5 portrait (148 mm x 210 mm)
  const doc = new jsPDF("p", "mm", "a5");

  // 2. Exact A5 layout dimensions
  const PAGE_WIDTH = 148;
  const PAGE_HEIGHT = 210;

  const MARGIN_LEFT = 6;
  const MARGIN_RIGHT = 6;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  const SCALE_X = PAGE_WIDTH / 210;
  const SCALE_Y = PAGE_HEIGHT / 297;

  const X = (value) => value * SCALE_X;
  const Y = (value) => value * SCALE_Y;
  const W = (value) => value * SCALE_X;
  const H = (value) => value * SCALE_Y;

  // 8. Fixed bottom coordinates for A5
  const FOOTER_Y = 205;
  const DECLARATION_Y = 170;
  const BANK_X = 76;
  const BANK_Y = 151;

  // Apply scaling helper functions and constants
  if (
    X(210) !== PAGE_WIDTH ||
    Y(297) !== PAGE_HEIGHT ||
    W(210) !== PAGE_WIDTH ||
    H(297) !== PAGE_HEIGHT ||
    FOOTER_Y > PAGE_HEIGHT
  ) {
    console.debug("A5 dimension check:", { SCALE_X, SCALE_Y, CONTENT_WIDTH });
  }

  const stampImg = new Image();
  stampImg.src = stamp;

  const isIntraState =
    merchantState?.toLowerCase().includes("karnataka");

  // ======================================================
  // MAXIMUM PRODUCTS PER PAGE & DYNAMIC OVERFLOW HANDLING
  // ======================================================
  const ITEMS_PER_PAGE = 5;

  const itemPages = [];
  let currentPage = [];

  for (const item of items) {
    const candidate = [...currentPage, item];

    const gstRates = new Set(
      candidate.map((it) => Number(it.gstRate ?? it.gst ?? 0) || 0)
    );
    const gstCount = gstRates.size === 0 ? 1 : gstRates.size;
    const numGstRows = (isIntraState ? gstCount * 2 : gstCount) + 1;

    let totalItemRowsHeight = 0;
    for (const it of candidate) {
      const nameLen = (it.product || "").length;
      const lines = Math.max(1, Math.ceil(nameLen / 28));
      totalItemRowsHeight += 2.2 + lines * 2.3;
    }

    // Estimated vertical footprint before BANK_Y (151)
    const estimatedBottom =
      93.5 + 4.5 + totalItemRowsHeight + numGstRows * 4.2 + 2 + 14;

    if (candidate.length <= ITEMS_PER_PAGE && estimatedBottom <= BANK_Y) {
      currentPage.push(item);
    } else {
      if (currentPage.length > 0) {
        itemPages.push(currentPage);
        currentPage = [item];
      } else {
        // If a single product with huge description exceeds, place it to avoid losing data
        currentPage.push(item);
        itemPages.push(currentPage);
        currentPage = [];
      }
    }
  }

  if (currentPage.length > 0) {
    itemPages.push(currentPage);
  }

  // If there are no products, still generate one invoice page.
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
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const gstRate = Number(item.gstRate ?? item.gst ?? 0) || 0;

      const rawAmount = quantity * rate;
      const discountedAmount =
        rawAmount * (1 - Number(discountPercent || 0) / 100);

      subtotal += rawAmount;
      taxableAmount += discountedAmount;
      totalQty += quantity;

      if (!gstBreakup[gstRate]) {
        gstBreakup[gstRate] = {
          taxable: 0,
          gst: 0,
        };
      }

      gstBreakup[gstRate].taxable += discountedAmount;
      gstBreakup[gstRate].gst += (discountedAmount * gstRate) / 100;
    });

    const gstTotal = Object.values(gstBreakup).reduce(
      (sum, group) => sum + group.gst,
      0
    );

    const grandTotal = taxableAmount + gstTotal;

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
  // DRAW HEADER (A5 RESIZED)
  // ======================================================
  const drawInvoiceHeader = (pageNumber, totalPages) => {
    // 3. Header title at explicit A5 positions
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("GST TAX INVOICE", 45, 8);

    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.text("(ORIGINAL FOR RECIPIENT)", 94, 8);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PROFORMA INVOICE", 49, 18);

    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(
      isIntraState
        ? "INTRA STATE SUPPLY (CGST + SGST)"
        : "INTER STATE SUPPLY (IGST)",
      36,
      23
    );

    // Logo: (7, 7), dimensions 13 x 13
    doc.addImage(logo, "JPEG", 7, 7, 13, 13);

    // Page continuation label at (87, 23), font size 6
    if (pageNumber > 1) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text(
        `CONTINUED - PAGE ${pageNumber} OF ${totalPages}`,
        87,
        23
      );
    }

    // ======================================================
    // 4. COMPANY DETAILS TABLE
    // ======================================================
    autoTable(doc, {
      startY: 28,
      margin: {
        left: MARGIN_LEFT,
        right: MARGIN_RIGHT,
      },
      tableWidth: CONTENT_WIDTH,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 1,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 31 },
        2: { cellWidth: 40 },
      },
      body: [
        [
          {
            content: `LASYA ENTERPRISES
Ward No.11
Khata No.007/4230
Melekote Gangasandra
Tumakuru - 572102
Karnataka
GSTIN : 29CIGPD0689G1Z4`,
            rowSpan: 3,
            styles: {
              fontStyle: "bold",
            },
          },
          "Invoice No.",
          {
            content: invoiceNo,
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Date",
          {
            content: date,
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Delivery Note",
          {
            content: deliveryNote || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
      ],
    });

    // ======================================================
    // 4. BUYER + DISPATCH DETAILS TABLE
    // ======================================================
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      margin: {
        left: MARGIN_LEFT,
        right: MARGIN_RIGHT,
      },
      tableWidth: CONTENT_WIDTH,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 1,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 31 },
        2: { cellWidth: 40 },
      },
      body: [
        [
          {
            content: `Buyer Details
${merchantName || "-"}
${merchantAddress || "-"}
GSTIN : ${merchantGST || "-"}
State : ${merchantState || "-"}
Place : ${merchantPlaceOfSupply || "-"}
Contact : ${merchantContactPerson || "-"}
Mobile : ${merchantMobile || "-"}`,
            rowSpan: 10,
            styles: {
              fontStyle: "bold",
            },
          },
          "Buyer's Order No",
          {
            content: buyersOrderNo || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Supplier Reference",
          {
            content: supplierRef || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Transporter Name",
          {
            content: transporterName || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "LR Number",
          {
            content: lrNumber || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Remarks",
          {
            content: remarks || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Dispatch Document No",
          {
            content: dispatchDocumentNo || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Dispatched Through",
          {
            content: deliveryPartner || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Destination",
          {
            content: destination || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          "Vehicle Number",
          {
            content: vehicleNumber || "-",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          {
            content: `Terms Of Delivery : ${termsOfDelivery || "-"}`,
            colSpan: 3,
            styles: {
              fontStyle: "bold",
              halign: "left",
            },
          },
        ],
      ],
    });
  };

  // ======================================================
  // PRODUCT + GST + TOTALS FOR ONE PAGE
  // ======================================================
  const drawProductAndTotals = (
    pageItems,
    calculations,
    pageNumber,
    pageStartIndex
  ) => {
    // 5. Product Rows with continuous serial numbering
    const productRows = pageItems.map((item, index) => [
      index + 1 + pageStartIndex,
      item.product,
      item.hsn || HSN_MAP[item.product] || "-",
      item.quantity,
      Number(item.rate || 0).toFixed(2),
      item.unit || "Nos",
      discountPercent || 0,
      (
        Number(item.quantity || 0) *
        Number(item.rate || 0) *
        (1 - Number(discountPercent || 0) / 100)
      ).toFixed(2),
    ]);

    // 5 & 9. Product Table with compact 2 mm gap
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      margin: {
        left: MARGIN_LEFT,
        right: MARGIN_RIGHT,
      },
      tableWidth: CONTENT_WIDTH,
      theme: "grid",
      head: [
        [
          "Sl No",
          "Description of Goods",
          "HSN/SAC",
          "Quantity",
          "Rate",
          "Per",
          "Disc %",
          "Amount",
        ],
      ],
      body: productRows,
      styles: {
        fontSize: 5.5,
        cellPadding: 1,
        halign: "center",
        valign: "middle",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 5.5,
        cellPadding: 1,
      },
      columnStyles: {
        0: { cellWidth: 8 },   // Serial number
        1: { cellWidth: 38 },  // Product description
        2: { cellWidth: 13 },  // HSN/SAC
        3: { cellWidth: 14 },  // Quantity
        4: { cellWidth: 17 },  // Rate
        5: { cellWidth: 10 },  // Unit
        6: { cellWidth: 12 },  // Discount
        7: { cellWidth: 24 },  // Amount
      },
    });

    const tableEndY = doc.lastAutoTable.finalY;

    // 6. GST Rows
    const gstRows = [];
    Object.keys(calculations.gstBreakup).forEach((rate) => {
      const gstAmount = calculations.gstBreakup[rate].gst;

      if (isIntraState) {
        gstRows.push([
          `Output CGST ${Number(rate) / 2}%`,
          "",
          "",
          (gstAmount / 2).toFixed(2),
        ]);
        gstRows.push([
          `Output SGST ${Number(rate) / 2}%`,
          "",
          "",
          (gstAmount / 2).toFixed(2),
        ]);
      } else {
        gstRows.push([
          `Output IGST ${rate}%`,
          "",
          "",
          gstAmount.toFixed(2),
        ]);
      }
    });

    gstRows.push([
      {
        content: "Total",
        styles: {
          fontStyle: "bold",
        },
      },
      {
        content: `${calculations.totalQty}`,
        styles: {
          fontStyle: "bold",
        },
      },
      {
        content: "Items",
        styles: {
          fontStyle: "bold",
        },
      },
      {
        content: calculations.grandTotal.toFixed(2),
        styles: {
          fontStyle: "bold",
        },
      },
    ]);

    // 6 & 9. GST Table
    autoTable(doc, {
      startY: tableEndY,
      theme: "grid",
      margin: {
        left: MARGIN_LEFT,
        right: MARGIN_RIGHT,
      },
      tableWidth: CONTENT_WIDTH,
      styles: {
        fontSize: 6,
        cellPadding: 1,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 76 },
        1: { cellWidth: 16 },
        2: { cellWidth: 16 },
        3: { cellWidth: 28 },
      },
      body: gstRows,
    });

    // ======================================================
    // 7. AMOUNT IN WORDS BOX
    // ======================================================
    const wordsY = doc.lastAutoTable.finalY + 2;

    doc.rect(MARGIN_LEFT, wordsY, CONTENT_WIDTH, 14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("Amount Chargeable (in words)", 9, wordsY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);

    const pageAmountInWords =
      "INR " +
      toWords(Math.round(calculations.grandTotal)).toUpperCase() +
      " ONLY";

    doc.text(pageAmountInWords, 9, wordsY + 8.5, {
      maxWidth: CONTENT_WIDTH - 6,
    });

    // ======================================================
    // 8. FIXED BOTTOM SECTION (A5 POSITIONS)
    // ======================================================

    // Bank Details (x = 76, y = 151)
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "bold");
    doc.text("Company's Bank Details", BANK_X, BANK_Y);

    doc.setFont("helvetica", "normal");
    doc.text("Bank Name : Canara Bank", BANK_X, BANK_Y + 3.5);
    doc.text("A/C No : 20071010001547", BANK_X, BANK_Y + 7);
    doc.text("IFSC : CNRB0012007", BANK_X, BANK_Y + 10.5);
    doc.text("Branch : TUMAKURU SIDDHARTHA", BANK_X, BANK_Y + 14);
    doc.text("INSTITUTE OF TECHNOLOGY", BANK_X, BANK_Y + 17.5);

    // Declaration Box (x = 6, y = 170, w = 68, h = 24)
    doc.rect(MARGIN_LEFT, DECLARATION_Y, 68, 24);

    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("Company's PAN : CIGPD0689G", 8, 167);

    doc.setFontSize(6);
    doc.text("Declaration", 8, 177);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.text("We declare that this invoice shows the actual price", 8, 182);
    doc.text("of the goods described and that all particulars", 8, 186);
    doc.text("are true and correct.", 8, 190);

    // Signature Box (x = 74, y = 170, w = 68, h = 24)
    doc.rect(74, DECLARATION_Y, 68, 24);

    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("For LASYA ENTERPRISES", 79, 176);

    // Stamp at x = 76, y = 172, w = 17, h = 17
    doc.addImage(stampImg, "JPEG", 76, 172, 17, 17);

    // Signature at x = 91, y = 179, w = 22, h = 8
    doc.addImage(signature, "PNG", 91, 179, 22, 8);

    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("Authorised Signatory", 91, 191);

    // Footer
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "italic");
    doc.text("SUBJECT TO TUMAKURU JURISDICTION", 30, 199);
    doc.text("This is a Computer Generated Invoice", 35, 203);

    // Page Number on multi-page invoices
    if (totalPages > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.text(`Page ${pageNumber} of ${totalPages}`, 119, 207);
    }
  };

  // ======================================================
  // GENERATE EACH PAGE
  // ======================================================
  let runningIndex = 0;

  itemPages.forEach((pageItems, pageIndex) => {
    const pageNumber = pageIndex + 1;
    const pageStartIndex = runningIndex;
    runningIndex += pageItems.length;

    // First page already exists; add subsequent pages
    if (pageNumber > 1) {
      doc.addPage();
    }

    // Calculate ONLY this page's items
    const calculations = calculatePageTotals(pageItems);

    console.log(`PAGE ${pageNumber} CALCULATIONS:`, calculations);

    // Draw the same invoice structure on every page
    drawInvoiceHeader(pageNumber, totalPages);
    drawProductAndTotals(
      pageItems,
      calculations,
      pageNumber,
      pageStartIndex
    );
  });

  // ======================================================
  // SAVE PDF
  // ======================================================
  doc.save(`Invoice_${merchantName}_${invoiceNo}.pdf`);
};

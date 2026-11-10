import {
  generateInvoicePDF,
  getInvoicePDFBlobUrl,
  printInvoicePDF,
} from "../utils/generateInvoicePDF";
import { getProducts } from "../api/product";
import { getMerchants, createManualOrder, getNextInvoiceNumber } from "../api/admin";
import Loader from "../components/Loader";
import { useState, useEffect, useRef } from "react";
import {
  Printer,
  Eye,
  Edit3,
  X,
  ArrowLeft,
  CheckCircle2,
  Download,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

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
  "Puducherry",
];

export default function AdminInvoiceGenerator() {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("form"); // "form" | "preview"
  const [discountPercent, setDiscountPercent] = useState(0);
  const [products, setProducts] = useState([]);

  // Registered merchants state
  const [merchants, setMerchants] = useState([]);
  const [loadingMerchants, setLoadingMerchants] = useState(true);
  const [merchantError, setMerchantError] = useState(null);
  const [selectedMerchantId, setSelectedMerchantId] = useState("");
  const [merchantSearch, setMerchantSearch] = useState("");
  const [showMerchantDropdown, setShowMerchantDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Preview & finalized order state
  const [previewInvoiceNumber, setPreviewInvoiceNumber] = useState("");
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [previewTotalPages, setPreviewTotalPages] = useState(1);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [savedOrder, setSavedOrder] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const [items, setItems] = useState([
    {
      product: "",
      hsn: "",
      unit: "",
      quantity: 1,
      rate: 0,
      gstRate: 5,
    },
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

  // Buyer Details
  const [merchantName, setMerchantName] = useState("");
  const [merchantGST, setMerchantGST] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [merchantState, setMerchantState] = useState("Karnataka");
  const [merchantPlaceOfSupply, setMerchantPlaceOfSupply] = useState("Karnataka");
  const [merchantContactPerson, setMerchantContactPerson] = useState("");
  const [merchantMobile, setMerchantMobile] = useState("");

  useEffect(() => {
    loadProducts();
    loadMerchants();
  }, []);

  // Close merchant dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMerchantDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        try {
          URL.revokeObjectURL(previewBlobUrl);
        } catch (e) {}
      }
    };
  }, [previewBlobUrl]);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const loadMerchants = async () => {
    try {
      setLoadingMerchants(true);
      setMerchantError(null);
      const res = await getMerchants();
      setMerchants(res.data || []);
    } catch (err) {
      console.error("Failed to load merchants:", err);
      setMerchantError(
        err.response?.data?.message || "Failed to load registered merchants."
      );
    } finally {
      setLoadingMerchants(false);
    }
  };

  // Automatically populate Buyer Details when a merchant is chosen
  const handleSelectMerchant = (m) => {
    if (!m) {
      clearSelectedMerchant();
      return;
    }
    setSelectedMerchantId(m.id);
    setMerchantSearch(`${m.shopName} (${m.ownerName})`);
    setMerchantName(m.shopName || "");
    setMerchantGST(m.gstNumber || "");
    setMerchantAddress(m.address || "");
    const stateVal = m.state || "Karnataka";
    setMerchantState(stateVal);
    setMerchantPlaceOfSupply(stateVal);
    setMerchantContactPerson(m.contactPerson || m.ownerName || "");
    setMerchantMobile(m.phone || "");
    setShowMerchantDropdown(false);
  };

  const clearSelectedMerchant = () => {
    setSelectedMerchantId("");
    setMerchantSearch("");
    setMerchantName("");
    setMerchantGST("");
    setMerchantAddress("");
    setMerchantState("Karnataka");
    setMerchantPlaceOfSupply("Karnataka");
    setMerchantContactPerson("");
    setMerchantMobile("");
  };

  const filteredMerchants = merchants.filter((m) => {
    if (!merchantSearch) return true;
    const q = merchantSearch.toLowerCase();
    return (
      (m.shopName && m.shopName.toLowerCase().includes(q)) ||
      (m.ownerName && m.ownerName.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.gstNumber && m.gstNumber.toLowerCase().includes(q))
    );
  });

  const validateInvoice = () => {
    const missing = [];

    if (!selectedMerchantId) {
      missing.push("Registered Merchant (Select from dropdown)");
    }
    if (!merchantName?.trim()) missing.push("Shop Name");
    if (!merchantGST?.trim()) missing.push("GST Number");
    if (!merchantAddress?.trim()) missing.push("Address");
    if (!merchantState?.trim()) missing.push("State");
    if (!merchantPlaceOfSupply?.trim()) missing.push("Place Of Supply");
    if (!merchantContactPerson?.trim()) missing.push("Contact Person");
    if (!merchantMobile?.trim()) missing.push("Phone Number");
    if (!shippingDetails.deliveryNote?.trim()) missing.push("Delivery Note");

    if (!items || items.length === 0) {
      alert("Please add at least one product row.");
      return false;
    }

    const emptyProduct = items.find((item) => !item.product || !item.product.trim());
    if (emptyProduct) {
      alert("Please select a product for every row.");
      return false;
    }

    const invalidQty = items.find((item) => !item.quantity || Number(item.quantity) <= 0);
    if (invalidQty) {
      alert("Quantity must be greater than 0 for all items.");
      return false;
    }

    const invalidRate = items.find(
      (item) => item.rate === undefined || item.rate === null || Number(item.rate) < 0
    );
    if (invalidRate) {
      alert("Rate must be greater than or equal to 0 for all items.");
      return false;
    }

    if (discountPercent < 0 || discountPercent > 100) {
      alert("Discount percentage must be between 0 and 100.");
      return false;
    }

    if (missing.length > 0) {
      alert("Please complete the following required fields:\n\n• " + missing.join("\n• "));
      return false;
    }

    return true;
  };

  // Financial calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableValue = subtotal - discountAmount;

  const gstTotal = items.reduce((sum, item) => {
    const itemTaxable = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
    const discounted = itemTaxable - (itemTaxable * discountPercent) / 100;
    return sum + (discounted * (Number(item.gstRate) || 0)) / 100;
  }, 0);

  const isIntraState = merchantState?.toLowerCase().includes("karnataka");
  const cgst = isIntraState ? gstTotal / 2 : 0;
  const sgst = isIntraState ? gstTotal / 2 : 0;
  const igst = isIntraState ? 0 : gstTotal;

  const grandTotal = taxableValue + gstTotal;

  // Build uniform payload for PDF generator
  const buildInvoicePayload = (invoiceNoToUse, dateToUse) => {
    return {
      invoiceNo: invoiceNoToUse,
      date: dateToUse,
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
      taxableAfterDiscount: taxableValue,
    };
  };

  // 1. PREVIEW INVOICE ACTION
  const handlePreviewInvoice = async () => {
    if (!validateInvoice()) return;

    try {
      setLoading(true);

      // Determine invoice number to display
      let currentInvoiceNo = savedOrder?.invoice || generatedInvoice;
      let currentDate = savedOrder?.createdAt
        ? new Date(savedOrder.createdAt).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN");

      if (!currentInvoiceNo) {
        // Fetch next sequential number from backend without consuming it
        try {
          const res = await getNextInvoiceNumber();
          if (res.data?.invoice) {
            currentInvoiceNo = res.data.invoice;
            setPreviewInvoiceNumber(currentInvoiceNo);
          }
        } catch (err) {
          console.warn("Could not fetch preview invoice number from backend:", err);
          currentInvoiceNo = previewInvoiceNumber || "PREVIEW-221";
        }
      }

      const invoiceData = buildInvoicePayload(currentInvoiceNo, currentDate);

      // Build PDF and obtain Blob URL
      const { blobUrl, totalPages } = await getInvoicePDFBlobUrl(invoiceData);

      // Revoke previous blob URL to prevent memory leaks
      if (previewBlobUrl) {
        try {
          URL.revokeObjectURL(previewBlobUrl);
        } catch (e) {}
      }

      setPreviewBlobUrl(blobUrl);
      setPreviewTotalPages(totalPages);
      setViewMode("preview");
    } catch (err) {
      console.error("Failed to build invoice preview:", err);
      alert("Failed to build invoice preview: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // 2. CONFIRM & PRINT ACTION
  const handleConfirmAndPrint = async () => {
    // If already finalized/saved, directly trigger print dialog without re-saving!
    if (savedOrder) {
      try {
        const currentDate = savedOrder.createdAt
          ? new Date(savedOrder.createdAt).toLocaleDateString("en-IN")
          : new Date().toLocaleDateString("en-IN");
        const invoiceData = buildInvoicePayload(savedOrder.invoice, currentDate);
        await printInvoicePDF(invoiceData);
      } catch (err) {
        console.error("Print error:", err);
        alert("Failed to open print dialog: " + err.message);
      }
      return;
    }

    // Required confirmation dialog
    const confirmed = window.confirm(
      "Are you sure all invoice details are correct? Once confirmed, the invoice will be finalized."
    );

    if (!confirmed) return;

    try {
      setIsFinalizing(true);

      const payload = {
        merchantId: Number(selectedMerchantId),
        buyer: {
          merchantName,
          merchantGST,
          merchantAddress,
          merchantState,
          merchantPlaceOfSupply,
          merchantContactPerson,
          merchantMobile,
        },
        shippingDetails: {
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
        },
        items,
        discountPercent,
        discountAmount,
        taxableValue,
        subtotal,
        gst: gstTotal,
        grandTotal,
      };

      const res = await createManualOrder(payload);
      const order = res.data;

      setSavedOrder(order);
      setGeneratedInvoice(order.invoice);

      const finalizedDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN");

      const finalizedInvoiceData = buildInvoicePayload(order.invoice, finalizedDate);

      // Refresh the preview blob URL with finalized invoice number
      const { blobUrl, totalPages } = await getInvoicePDFBlobUrl(finalizedInvoiceData);
      if (previewBlobUrl) {
        try {
          URL.revokeObjectURL(previewBlobUrl);
        } catch (e) {}
      }
      setPreviewBlobUrl(blobUrl);
      setPreviewTotalPages(totalPages);

      // Open the browser print dialog with the finalized A5 invoice
      await printInvoicePDF(finalizedInvoiceData);

      alert(`✅ Invoice finalized and saved successfully!\nInvoice Number: ${order.invoice}`);
    } catch (err) {
      console.error("Failed to finalize and print invoice:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to finalize invoice. Please check server logs."
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  // Download PDF Action
  const handleDownloadPDF = async () => {
    try {
      const currentInvoiceNo =
        savedOrder?.invoice || generatedInvoice || previewInvoiceNumber || "Invoice";
      const currentDate = savedOrder?.createdAt
        ? new Date(savedOrder.createdAt).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN");
      const invoiceData = buildInvoicePayload(currentInvoiceNo, currentDate);
      await generateInvoicePDF(invoiceData);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download invoice: " + (err.message || "Unknown error"));
    }
  };

  // 3. EDIT DETAILS ACTION
  const handleEditDetails = () => {
    setViewMode("form");
  };

  // 4. CANCEL PREVIEW ACTION
  const handleCancelPreview = () => {
    setViewMode("form");
  };

  // Reset form to start a completely new invoice
  const handleResetForm = () => {
    if (previewBlobUrl) {
      try {
        URL.revokeObjectURL(previewBlobUrl);
      } catch (e) {}
    }
    setPreviewBlobUrl(null);
    setPreviewInvoiceNumber("");
    setGeneratedInvoice(null);
    setSavedOrder(null);
    setViewMode("form");
    clearSelectedMerchant();
    setShippingDetails({
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
    setItems([
      {
        product: "",
        hsn: "",
        unit: "",
        quantity: 1,
        rate: 0,
        gstRate: 5,
      },
    ]);
    setDiscountPercent(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* ========================================================
          INVOICE PREVIEW SCREEN (MODAL / OVERLAY VIEW)
          ======================================================== */}
      {viewMode === "preview" && (
        <div className="min-h-screen bg-slate-900/90 fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 backdrop-blur-sm flex flex-col">
          {/* TOP CONTROLS BAR */}
          <div className="max-w-5xl mx-auto w-full bg-white rounded-xl shadow-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 sticky top-2 z-10 border border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleEditDetails}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg text-sm font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit Details
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                  Invoice Preview
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    A5 Portrait (148 × 210 mm)
                  </span>
                </h1>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {savedOrder ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Finalized: {savedOrder.invoice}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Draft Preview (Invoice #{previewInvoiceNumber || "Pending"})
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-medium">
                    • {previewTotalPages} {previewTotalPages > 1 ? "Pages" : "Page"}
                  </span>
                </div>
              </div>
            </div>

            {/* THREE PRIMARY ACTIONS + DOWNLOAD */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleCancelPreview}
                className="px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 text-sm font-medium transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                title="Download PDF Copy"
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-300 text-sm font-medium flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                type="button"
                disabled={isFinalizing}
                onClick={handleConfirmAndPrint}
                className={`px-5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-md transition ${
                  isFinalizing
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                }`}
              >
                <Printer className="w-4 h-4" />
                {isFinalizing ? (
                  "Finalizing & Printing..."
                ) : savedOrder ? (
                  "Print Finalized Invoice"
                ) : (
                  "Confirm & Print"
                )}
              </button>
            </div>
          </div>

          {/* MAIN PREVIEW CONTAINER (EXACT A5 ASPECT RATIO) */}
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
            <div className="w-full bg-slate-800/60 p-3 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col items-center">
              <div className="text-xs text-slate-300 mb-2 flex items-center justify-between w-full max-w-[680px] px-1">
                <span>📄 Exact A5 Print Layout (Scroll inside to inspect continuation pages)</span>
                <span>Multi-page verified</span>
              </div>

              <div
                className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-400 w-full max-w-[680px]"
                style={{ height: "calc(100vh - 240px)", minHeight: "560px" }}
              >
                {previewBlobUrl ? (
                  <iframe
                    id="invoice-preview-iframe"
                    key={previewBlobUrl}
                    src={previewBlobUrl}
                    className="w-full h-full border-0"
                    title="Invoice PDF Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Loader text="Generating preview..." />
                  </div>
                )}
              </div>

              {/* BOTTOM ACTIONS BAR */}
              <div className="w-full max-w-[680px] mt-4 flex items-center justify-between gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                  type="button"
                  onClick={handleEditDetails}
                  className="px-4 py-2 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-sm font-semibold flex items-center gap-1.5 transition shadow"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Details
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelPreview}
                    className="px-4 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 text-sm font-medium transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isFinalizing}
                    onClick={handleConfirmAndPrint}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg transition"
                  >
                    <Printer className="w-4 h-4" />
                    {isFinalizing
                      ? "Finalizing..."
                      : savedOrder
                      ? "Print Finalized Invoice"
                      : "Confirm & Print"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ADMIN MANUAL INVOICE FORM
          ======================================================== */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
        {/* LEFT SECTION */}
        <div className="md:col-span-3 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Lasya Enterprises</h1>
              <p className="text-gray-500 mt-1">Manual Invoice Generator (Admin)</p>
            </div>
            {generatedInvoice && (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-sm font-mono font-bold px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Invoice: {generatedInvoice}
                </span>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1 transition"
                  title="Create a new invoice"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New
                </button>
              </div>
            )}
          </div>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">HSN</th>
                  <th className="p-3 border text-center">Qty</th>
                  <th className="p-3 border text-center">Unit</th>
                  <th className="p-3 border text-center">Rate</th>
                  <th className="p-3 border text-center">GST %</th>
                  <th className="p-3 border text-center">GST Amount</th>
                  <th className="p-3 border text-center">Total</th>
                  <th className="p-3 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const itemSubtotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  const discountedTaxable =
                    itemSubtotal - (itemSubtotal * discountPercent) / 100;
                  const itemGST = (discountedTaxable * (Number(item.gstRate) || 0)) / 100;
                  const itemTotal = discountedTaxable + itemGST;

                  return (
                    <tr key={index}>
                      <td className="border p-3 min-w-[200px]">
                        <select
                          value={item.product}
                          disabled={generatedInvoice !== null}
                          className="border p-2 rounded w-full bg-white disabled:bg-gray-100"
                          onChange={(e) => {
                            const selected = products.find(
                              (p) => p.product === e.target.value
                            );
                            if (!selected) return;

                            const updated = [...items];
                            updated[index] = {
                              ...updated[index],
                              product: selected.product,
                              hsn: selected.hsn || "",
                              unit: selected.unit,
                              rate: selected.price,
                              gstRate: selected.gst,
                            };
                            setItems(updated);
                          }}
                        >
                          <option value="">Select Product</option>
                          {products
                            .filter(
                              (product) =>
                                !items.some(
                                  (i, idx) =>
                                    idx !== index && i.product === product.product
                                ) || product.product === item.product
                            )
                            .map((product) => (
                              <option key={product.id} value={product.product}>
                                {product.product}
                              </option>
                            ))}
                        </select>
                      </td>

                      <td className="border p-3">
                        <input
                          value={item.hsn}
                          readOnly
                          className="border p-2 rounded w-24 bg-gray-100 text-center"
                        />
                      </td>

                      <td className="border p-3 text-center">
                        <input
                          type="number"
                          min={1}
                          disabled={generatedInvoice !== null}
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[index].quantity = Number(e.target.value);
                            setItems(updated);
                          }}
                          className="border p-2 rounded w-20 text-center disabled:bg-gray-100"
                        />
                      </td>

                      <td className="border p-3 text-center">
                        <input
                          value={item.unit}
                          readOnly
                          className="border p-2 rounded w-20 bg-gray-100 text-center"
                        />
                      </td>

                      <td className="border p-3 text-center">
                        <input
                          type="number"
                          value={item.rate}
                          readOnly
                          className="border p-2 rounded w-24 bg-gray-100 text-right"
                        />
                      </td>

                      <td className="border p-3 text-center">
                        <input
                          type="number"
                          value={item.gstRate}
                          readOnly
                          className="border p-2 rounded w-20 bg-gray-100 text-center"
                        />
                      </td>

                      <td className="border p-3 text-center">
                        ₹{itemGST.toFixed(2)}
                      </td>

                      <td className="border p-3 text-center font-medium">
                        ₹{itemTotal.toFixed(2)}
                      </td>

                      <td className="border p-3 text-center">
                        <button
                          type="button"
                          disabled={generatedInvoice !== null}
                          onClick={() => {
                            const updated = items.filter((_, i) => i !== index);
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
                                      gstRate: 5,
                                    },
                                  ]
                            );
                          }}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            disabled={generatedInvoice !== null || items.length >= products.length}
            onClick={() =>
              setItems([
                ...items,
                {
                  product: "",
                  hsn: "",
                  unit: "",
                  quantity: 1,
                  rate: 0,
                  gstRate: 5,
                },
              ])
            }
            className={`mt-5 px-5 py-2 rounded text-white ${
              generatedInvoice !== null || items.length >= products.length
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            + Add Another Product
          </button>

          {/* BUYER DETAILS */}
          <div className="border rounded-lg p-5 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Buyer Details</h2>
              {selectedMerchantId && !generatedInvoice && (
                <button
                  type="button"
                  onClick={clearSelectedMerchant}
                  className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Clear / Switch Merchant
                </button>
              )}
            </div>

            {/* REGISTERED MERCHANT SEARCHABLE DROPDOWN */}
            <div className="mb-4" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Registered Merchant <span className="text-red-500">*</span>
              </label>

              {loadingMerchants ? (
                <div className="border p-3 rounded-lg bg-gray-50 text-gray-500 text-sm flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  Loading registered merchants...
                </div>
              ) : merchantError ? (
                <div className="border border-red-300 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex justify-between items-center">
                  <span>{merchantError}</span>
                  <button
                    type="button"
                    onClick={loadMerchants}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      disabled={generatedInvoice !== null}
                      placeholder="Select Registered Merchant (type to search)..."
                      value={merchantSearch}
                      onChange={(e) => {
                        setMerchantSearch(e.target.value);
                        setShowMerchantDropdown(true);
                      }}
                      onFocus={() => setShowMerchantDropdown(true)}
                      className="border p-3 rounded-lg w-full pr-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100"
                    />
                    <button
                      type="button"
                      disabled={generatedInvoice !== null}
                      onClick={() => setShowMerchantDropdown(!showMerchantDropdown)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ▼
                    </button>
                  </div>

                  {showMerchantDropdown && !generatedInvoice && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl">
                      <div
                        className="p-2.5 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer border-b italic"
                        onClick={() => {
                          clearSelectedMerchant();
                          setShowMerchantDropdown(false);
                        }}
                      >
                        -- Select Registered Merchant --
                      </div>
                      {filteredMerchants.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          No matching merchants found
                        </div>
                      ) : (
                        filteredMerchants.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleSelectMerchant(m)}
                            className={`p-3 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition ${
                              String(selectedMerchantId) === String(m.id)
                                ? "bg-blue-100 font-semibold text-blue-900"
                                : "text-gray-800"
                            }`}
                          >
                            <div className="font-semibold text-gray-900">
                              {m.shopName}{" "}
                              {m.ownerName ? (
                                <span className="font-normal text-gray-600">
                                  ({m.ownerName})
                                </span>
                              ) : null}
                            </div>
                            <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                              {m.gstNumber && <span>GST: {m.gstNumber}</span>}
                              {m.phone && <span>Ph: {m.phone}</span>}
                              {m.state && <span>State: {m.state}</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auto-populated & editable Buyer Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Shop Name
                </label>
                <input
                  placeholder="Shop Name"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  GST Number
                </label>
                <input
                  placeholder="GST Number"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={merchantGST}
                  onChange={(e) => setMerchantGST(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Address
                </label>
                <input
                  placeholder="Address"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={merchantAddress}
                  onChange={(e) => setMerchantAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  State
                </label>
                <select
                  className="border p-3 rounded w-full bg-white disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={merchantState}
                  onChange={(e) => {
                    setMerchantState(e.target.value);
                    setMerchantPlaceOfSupply(e.target.value);
                  }}
                >
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Place Of Supply
                </label>
                <input
                  placeholder="Place Of Supply"
                  value={merchantPlaceOfSupply}
                  readOnly
                  className="border p-3 rounded w-full bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Contact Person
                </label>
                <input
                  placeholder="Contact Person"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={merchantContactPerson}
                  onChange={(e) => setMerchantContactPerson(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  placeholder="Phone Number"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={merchantMobile}
                  onChange={(e) => setMerchantMobile(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ORDER & DISPATCH DETAILS */}
          <div className="border rounded-lg p-5 mt-6">
            <h2 className="text-xl font-semibold mb-4">Order & Dispatch Details</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Delivery Note <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Delivery Note"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.deliveryNote}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      deliveryNote: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Buyer's Order No
                </label>
                <input
                  placeholder="Buyer's Order No"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.buyersOrderNo}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      buyersOrderNo: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Supplier Reference
                </label>
                <input
                  placeholder="Supplier Reference"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.supplierRef}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      supplierRef: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Transporter Name
                </label>
                <input
                  placeholder="Transporter Name"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.transporterName}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      transporterName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  LR Number
                </label>
                <input
                  placeholder="LR Number"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.lrNumber}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      lrNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Dispatch Document No
                </label>
                <input
                  placeholder="Dispatch Document No"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.dispatchDocumentNo}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      dispatchDocumentNo: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Dispatched Through
                </label>
                <select
                  className="border p-3 rounded w-full bg-white disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.dispatchedThrough}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      dispatchedThrough: e.target.value,
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Destination
                </label>
                <input
                  placeholder="Destination"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.destination}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      destination: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Vehicle Number
                </label>
                <input
                  placeholder="Vehicle Number"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.vehicleNumber}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      vehicleNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Terms Of Delivery
                </label>
                <select
                  className="border p-3 rounded w-full bg-white disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  value={shippingDetails.termsOfDelivery}
                  onChange={(e) =>
                    setShippingDetails({
                      ...shippingDetails,
                      termsOfDelivery: e.target.value,
                    })
                  }
                >
                  <option value="">Select Terms Of Delivery</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Within 3 Days">Within 3 Days</option>
                  <option value="Within 7 Days">Within 7 Days</option>
                  <option value="As Per Agreement">As Per Agreement</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Remarks (Optional)
                </label>
                <textarea
                  placeholder="Remarks (Optional)"
                  className="border p-3 rounded w-full disabled:bg-gray-100"
                  disabled={generatedInvoice !== null}
                  rows={2}
                  value={shippingDetails.remarks}
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
        </div>

        {/* RIGHT SECTION — PRICE DETAILS & PREVIEW TRIGGER */}
        <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-6">
          <h2 className="text-2xl font-bold mb-6">Price Details</h2>

          <div className="space-y-4 text-sm">
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
                disabled={generatedInvoice !== null}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                className="border rounded w-20 p-1 text-right disabled:bg-gray-100"
              />
            </div>

            <div className="flex justify-between">
              <span>Discount Amount</span>
              <span>₹{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Taxable After Discount</span>
              <span>₹{taxableValue.toFixed(2)}</span>
            </div>

            <hr />

            {isIntraState ? (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>CGST</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>SGST</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-gray-600">
                <span>IGST (Inter-State)</span>
                <span>₹{igst.toFixed(2)}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* GENERATED INVOICE SUCCESS CARD */}
          {generatedInvoice && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">Invoice Finalized & Saved</span>
              </div>
              <p className="font-mono text-base font-bold text-emerald-800 break-all">
                {generatedInvoice}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePreviewInvoice}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-semibold shadow transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  View Finalized Preview / Print
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 py-1.5 rounded text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  + Create Another Invoice
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW INVOICE BUTTON */}
          {!generatedInvoice && (
            <button
              type="button"
              onClick={handlePreviewInvoice}
              disabled={loading}
              className={`w-full py-3 rounded-lg mt-6 text-white font-semibold transition flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95"
              }`}
            >
              {loading ? (
                <div className="flex justify-center">
                  <Loader text="Preparing Preview..." />
                </div>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Preview Invoice
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

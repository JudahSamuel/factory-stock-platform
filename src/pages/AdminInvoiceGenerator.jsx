import { generateInvoicePDF } from "../utils/generateInvoicePDF";
import { getProducts } from "../api/product";
import { getMerchants, createManualOrder } from "../api/admin";
import Loader from "../components/Loader";
import { useState, useEffect, useRef } from "react";

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

  // Successfully generated invoice from backend
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [savedOrder, setSavedOrder] = useState(null);

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

    const emptyProduct = items.find((item) => !item.product || !item.product.trim());
    if (emptyProduct) {
      alert("Please select a product for every row.");
      return false;
    }

    const invalidQty = items.find((item) => !item.quantity || item.quantity <= 0);
    if (invalidQty) {
      alert("Quantity must be greater than 0 for all items.");
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

  const generateInvoice = async () => {
    if (loading) return;

    // If already generated for this current form state, re-download PDF without generating duplicate
    if (generatedInvoice) {
      handleDownloadExistingPDF();
      return;
    }

    if (!validateInvoice()) return;

    try {
      setLoading(true);

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

      setGeneratedInvoice(order.invoice);
      setSavedOrder(order);

      // Generate & download the PDF with the saved invoice number from backend
      generateInvoicePDF({
        invoiceNo: order.invoice,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN")
          : new Date().toLocaleDateString("en-IN"),
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
      });

      alert(`✅ Invoice generated and saved successfully!\nInvoice Number: ${order.invoice}`);
    } catch (err) {
      console.error("Failed to generate manual invoice:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate manual invoice. Please check server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExistingPDF = () => {
    if (!generatedInvoice) return;
    generateInvoicePDF({
      invoiceNo: generatedInvoice,
      date: savedOrder?.createdAt
        ? new Date(savedOrder.createdAt).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN"),
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
    });
  };

  const handleResetForm = () => {
    setGeneratedInvoice(null);
    setSavedOrder(null);
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
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
        {/* LEFT SECTION */}
        <div className="md:col-span-3 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Lasya Enterprises</h1>
              <p className="text-gray-500 mt-1">Manual Invoice Generator (Admin)</p>
            </div>
            {generatedInvoice && (
              <span className="bg-emerald-100 text-emerald-800 text-sm font-mono font-bold px-3 py-1.5 rounded-lg border border-emerald-300">
                Invoice: {generatedInvoice}
              </span>
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

        {/* RIGHT SECTION — PRICE DETAILS & ACTIONS */}
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
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-bold text-sm">Invoice Created & Saved</span>
              </div>
              <p className="font-mono text-base font-bold text-emerald-800 break-all">
                {generatedInvoice}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExistingPDF}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-semibold shadow transition"
                >
                  Download PDF Again
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 py-1.5 rounded text-xs font-medium transition"
                >
                  + Create Another Invoice
                </button>
              </div>
            </div>
          )}

          {/* GENERATE INVOICE BUTTON */}
          {!generatedInvoice && (
            <button
              onClick={generateInvoice}
              disabled={loading}
              className={`w-full py-3 rounded-lg mt-6 text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-md"
              }`}
            >
              {loading ? (
                <div className="flex justify-center">
                  <Loader text="Saving & Generating..." />
                </div>
              ) : (
                "Generate Invoice"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

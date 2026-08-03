import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInvoice } from "../api/order";
import { generateInvoicePDF } from "../utils/generateInvoicePDF";

export default function Invoice() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadInvoice = async () => {
            try {
                const res = await getInvoice(id);

                const order = res.data;

                console.log("Invoice Order:", order);

                console.log("Invoice Response:", res.data);
console.log("Merchant:", res.data.merchant);
console.log("Invoice:", res.data.invoice);

                generateInvoicePDF({
                    // Invoice Details
                    invoiceNo: order.invoice,
                    date: new Date(order.createdAt).toLocaleDateString(),

                    // Buyer Details
                    merchantName: order.merchant?.shopName || "",
                    merchantGST: order.gstNumber,
                    merchantAddress: order.shippingAddress,
                    merchantState: order.state,
                    merchantPlaceOfSupply: order.placeOfSupply,
                    merchantContactPerson: order.contactPerson,
                    merchantMobile: order.phone,

                    // Order Details
                    deliveryNote: order.deliveryNote,
                    buyersOrderNo: order.buyersOrderNo,
                    remarks: order.remarks,

                    // Dispatch Details
                    supplierRef: order.supplierRef,
                    dispatchDocumentNo: order.dispatchDocumentNo,
                    deliveryPartner: order.deliveryPartner,
                    transporterName: order.transporterName,
                    vehicleNumber: order.vehicleNumber,
                    destination: order.destination,
                    lrNumber: order.lrNumber,
                    termsOfDelivery: order.termsOfDelivery,

                    // Items
                    items: order.items,

                    // Totals
                    subtotal: order.subtotal,
                    gstTotal: order.gst,
                    grandTotal: order.grandTotal,

                    discountPercent: order.discountPercent,
                    discountAmount: order.discountAmount,
                    taxableAfterDiscount: order.taxableAmount
                });

                setTimeout(() => {
                    navigate("/my-orders");
                }, 500);

            } catch (err) {
                console.error(err);
                alert("Unable to load invoice.");
            }
        };

        loadInvoice();
    }, [id, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-2xl font-semibold">
                Generating Invoice...
            </h2>
        </div>
    );
}
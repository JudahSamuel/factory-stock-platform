import prisma from "../config/prisma.js";
import { allocateInvoiceNumber } from "../services/invoiceCounter.service.js";

export const createOrder = async (req, res) => {
    try {

        const {
            merchantId,
            subtotal,
            gst,
            grandTotal,
            buyer,
            shippingDetails,
            items,
            discountPercent = 0,
            discountAmount = 0,
            taxableValue = 0,
        } = req.body;

        console.log("Shipping Details Received:", shippingDetails);

        // Perform atomic allocation and order creation in database transaction
        const order = await prisma.$transaction(async (tx) => {
            const { invoice } = await allocateInvoiceNumber(tx);
            console.log("🔥 GENERATED INVOICE:", invoice);

            return await tx.order.create({
                data: {
                    invoice,

                    merchantId: Number(merchantId),

                    subtotal: Number(subtotal),
                    gst: Number(gst),
                    grandTotal: Number(grandTotal),

                    discountPercent: Number(discountPercent || 0),
                    discountAmount: Number(discountAmount || 0),
                    taxableAmount: Number(taxableValue || (subtotal - (discountAmount || 0)) || 0),

                    state: buyer?.merchantState || "Karnataka",
                    placeOfSupply: buyer?.merchantPlaceOfSupply || buyer?.merchantState || "Karnataka",

                    status: "Pending",
                    paymentStatus: "Pending",

                    // Order Details
                    deliveryNote: shippingDetails?.deliveryNote || "",
                    buyersOrderNo: shippingDetails?.buyersOrderNo || "",
                    remarks: shippingDetails?.remarks || "",
                    supplierRef: shippingDetails?.supplierRef || "",
                    dispatchDocumentNo: shippingDetails?.dispatchDocumentNo || "",
                    deliveryPartner: shippingDetails?.dispatchedThrough || shippingDetails?.deliveryPartner || "",
                    transporterName: shippingDetails?.transporterName || "",
                    vehicleNumber: shippingDetails?.vehicleNumber || "",
                    destination: shippingDetails?.destination || "",
                    lrNumber: shippingDetails?.lrNumber || "",
                    termsOfDelivery: shippingDetails?.termsOfDelivery || "",

                    // Buyer Details
                    shippingAddress: buyer?.merchantAddress || "",
                    contactPerson: buyer?.merchantContactPerson || "",
                    phone: buyer?.merchantMobile || "",
                    gstNumber: buyer?.merchantGST || "",

                    items: {
                        create: items.map(item => ({
                            product: item.product,
                            hsn: item.hsn || null,
                            quantity: Number(item.quantity),
                            rate: Number(item.rate),
                            gst: Number(item.gstRate ?? item.gst ?? 0),
                            amount: Number(item.quantity) * Number(item.rate)
                        }))
                    }
                },

                include: {
                    items: true
                }
            });
        });

        res.json(order);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

export const getOrders = async (req, res) => {

    try {

        const merchantId = Number(req.params.id);

        const orders = await prisma.order.findMany({

            where: {
                merchantId
            },

            include: {
                items: true
            },

            orderBy: {
                createdAt: "desc"
            }

        });

        res.json(orders);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};

// ===========================
// GET SINGLE INVOICE
// ===========================

export const getInvoice = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                merchant: true,
                items: true
            }
        });

        console.log(JSON.stringify(order, null, 2));

        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Delete related credit note first
        await prisma.creditNote.deleteMany({
            where: {
                orderId: orderId
            }
        });

        // Delete order items
        await prisma.orderItem.deleteMany({
            where: {
                orderId: orderId
            }
        });

        // Delete the order
        await prisma.order.delete({
            where: {
                id: orderId
            }
        });

        res.json({
            message: "Order deleted successfully"
        });

    } catch (err) {

        console.error("DELETE ORDER ERROR:", err);

        res.status(500).json({
            message: err.message
        });

    }
};
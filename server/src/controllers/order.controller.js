import prisma from "../config/prisma.js";

export const createOrder = async (req, res) => {
    try {

        const {
            merchantId,
            subtotal,
            gst,
            grandTotal,
            buyer,
            shippingDetails,
            items
        } = req.body;

        console.log("Shipping Details Received:", shippingDetails);

        const now = new Date();

const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();

const todayStart = new Date(now);
todayStart.setHours(0, 0, 0, 0);

const tomorrow = new Date(todayStart);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayOrderCount = await prisma.order.count({
    where: {
        createdAt: {
            gte: todayStart,
            lt: tomorrow
        }
    }
});

const invoiceNumber = String(todayOrderCount + 1).padStart(4, "0");

const invoice = `${day}${month}${year}-${invoiceNumber}`;

console.log("🔥 GENERATED INVOICE:", invoice);

console.log("Generated Invoice Number:", invoice);

        console.log("========== ITEMS RECEIVED ==========");
        console.log(JSON.stringify(items, null, 2));

        const order = await prisma.order.create({
            data: {
                invoice,

                merchantId,

                subtotal,
                gst,
                grandTotal,

                state: buyer.merchantState,
                placeOfSupply: buyer.merchantPlaceOfSupply,

                status: "Pending",
                paymentStatus: "Pending",

                // Order Details
                deliveryNote: shippingDetails.deliveryNote,
                buyersOrderNo: shippingDetails.buyersOrderNo,
                remarks: shippingDetails.remarks,

                // Buyer Details
                shippingAddress: buyer.merchantAddress,
                contactPerson: buyer.merchantContactPerson,
                phone: buyer.merchantMobile,
                gstNumber: buyer.merchantGST,

                items: {
                    create: items.map(item => ({
                        product: item.product,
                        hsn: item.hsn,
                        quantity: item.quantity,
                        rate: item.rate,
                        gst: item.gstRate,
                        amount: item.quantity * item.rate
                    }))
                }
            },

            include: {
                items: true
            }
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
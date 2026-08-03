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

        const invoice = "INV" + Date.now();

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
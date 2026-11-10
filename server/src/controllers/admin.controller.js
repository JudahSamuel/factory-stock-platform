import prisma from "../config/prisma.js";
import { allocateInvoiceNumber, getNextInvoiceNumber } from "../services/invoiceCounter.service.js";

export const getAllOrders = async (req, res) => {

    try {

        const orders = await prisma.order.findMany({

            include: {
                merchant: true,
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


export const updateOrderStatus = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const {

            status,

            discountPercent = 0

        } = req.body;

        const order = await prisma.order.findUnique({

            where: {

                id

            },

            include: {

                items: true

            }

        });

        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }

        //------------------------------------------------
        // APPROVE ORDER
        //------------------------------------------------

        if (

            status === "Approved" &&

            order.status === "Pending"

        ) {

            //------------------------------------------------
            // CHECK STOCK
            //------------------------------------------------

            for (const item of order.items) {

                const product =

                    await prisma.product.findUnique({

                        where: {

                            product: item.product

                        }

                    });

                if (!product) {

                    return res.status(400).json({

                        message: `${item.product} not found`

                    });

                }

                if (

                    product.stock < item.quantity

                ) {

                    return res.status(400).json({

                        message:

                            `${item.product} stock is insufficient`

                    });

                }

            }

            //------------------------------------------------
            // DEDUCT STOCK
            //------------------------------------------------

            for (const item of order.items) {

                await prisma.product.update({

                    where: {

                        product: item.product

                    },

                    data: {

                        stock: {

                            decrement: item.quantity

                        }

                    }

                });

            }

            //------------------------------------------------
            // APPLY DISCOUNT
            //------------------------------------------------

            const discountAmount =

                Number(

                    (

                        order.subtotal *

                        discountPercent /

                        100

                    ).toFixed(2)

                );

            const taxableAmount =

                Number(

                    (

                        order.subtotal -

                        discountAmount

                    ).toFixed(2)

                );

            const gst =

                Number(

                    (

                        taxableAmount *

                        (

                            order.gst /

                            order.subtotal

                        )

                    ).toFixed(2)

                );

            const grandTotal =

                Number(

                    (

                        taxableAmount +

                        gst

                    ).toFixed(2)

                );

            const updated =

                await prisma.order.update({

                    where: {

                        id

                    },

                    data: {

                        status,

                        discountPercent,

                        discountAmount,

                        taxableAmount,

                        gst,

                        grandTotal

                    }

                });

                await prisma.creditNote.create({

    data:{

        orderId: updated.id,

        merchantId: updated.merchantId,

        invoice: updated.invoice,

        amount: updated.grandTotal,

        paidAmount:0,

        balance:updated.grandTotal,

        dueDate:new Date(

            Date.now()+30*24*60*60*1000

        ),

        status:"Pending"

    }   

});

            return res.json(updated);

        }

        //------------------------------------------------
// NORMAL STATUS UPDATE
//------------------------------------------------

const updated = await prisma.order.update({

    where: {

        id

    },

    data: {

        status,

        deliveredDate:

            status === "Delivered"

                ? new Date()

                : undefined

    }

});

res.json(updated);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

export const updatePaymentStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { paymentStatus } = req.body;

        const order = await prisma.order.update({

            where: {
                id: Number(id)
            },

            data: {
                paymentStatus
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



    export const updateDelivery = async (req, res) => {

    console.log("========== DELIVERY ==========");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Params:", req.params);


    try {

        const id = Number(req.params.id);

        const {

    supplierRef,

    dispatchDocumentNo,

    deliveryPartner,

    transporterName,

    vehicleNumber,

    destination,

    lrNumber,

    dispatchDate,

    expectedDate,

    deliveredDate,

    termsOfDelivery

} = req.body;

        const order = await prisma.order.update({

    where: {

        id

    },

    data: {

    supplierRef: supplierRef ?? "",

    dispatchDocumentNo: dispatchDocumentNo ?? "",

    deliveryPartner: deliveryPartner ?? "",

    transporterName: transporterName ?? "",

    vehicleNumber: vehicleNumber ?? "",

    destination: destination ?? "",

    lrNumber: lrNumber ?? "",

    termsOfDelivery: termsOfDelivery ?? "",

    dispatchDate: dispatchDate
        ? new Date(dispatchDate)
        : null,

    expectedDate: expectedDate
        ? new Date(expectedDate)
        : null,

    deliveredDate: deliveredDate
        ? new Date(deliveredDate)
        : null,

    status: "Dispatched"

}

});



        res.json(order);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
export const getPendingMerchants = async (req, res) => {

    const merchants = await prisma.merchant.findMany({

        where: {
            approved: false
        },

        orderBy: {
            createdAt: "desc"
        }

    });

    res.json(merchants);

};

export const approveMerchant = async (req, res) => {

    const id = Number(req.params.id);

    await prisma.merchant.update({

        where: {
            id
        },

        data: {
            approved: true
        }

    });

    res.json({
        success: true
    });

};

export const getAllMerchants = async (req, res) => {

    try {

        const merchants = await prisma.merchant.findMany({

            where: {
                approved: true
            },

            include: {
                orders: true,
                creditNotes: true
            },

            orderBy: {
                shopName: "asc"
            }

        });

        const data = merchants.map((m) => {

            const totalCredit = m.creditNotes.reduce(
                (sum, note) => sum + note.balance,
                0
            );

            return {

                id: m.id,
                ownerName: m.ownerName,
                shopName: m.shopName,
                email: m.email,
                phone: m.phone,
                gstNumber: m.gstNumber,
                address: m.address || "",
                state: m.state || "Karnataka",
                contactPerson: m.contactPerson || "",
                totalOrders: m.orders.length,
                credit: totalCredit,
                approved: m.approved

            };

        });

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

};

export const getMerchantDetails = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const merchant = await prisma.merchant.findUnique({

            where: {
                id
            },

            include: {

                orders: {

                    orderBy: {
                        createdAt: "desc"
                    }

                },

                creditNotes: {

                    orderBy: {
                        createdAt: "desc"
                    }

                }

            }

        });

        if (!merchant) {

            return res.status(404).json({
                message: "Merchant not found"
            });

        }

        res.json(merchant);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};

// ===========================
// DELETE ORDER
// ===========================

export const deleteOrder = async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: {
                id
            }
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Delete related credit note
        await prisma.creditNote.deleteMany({
            where: {
                orderId: id
            }
        });

        // Delete related order items
        await prisma.orderItem.deleteMany({
            where: {
                orderId: id
            }
        });

        // Delete the order
        await prisma.order.delete({
            where: {
                id
            }
        });

        console.log(`🗑️ Order ${id} (${order.invoice}) deleted by admin`);

        res.json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (err) {

        console.error("DELETE ORDER ERROR:", err);

        res.status(500).json({
            message: err.message
        });

    }

};

// ===========================
// CREATE MANUAL INVOICE / ORDER (ADMIN)
// ===========================

export const createManualOrder = async (req, res) => {
    try {
        const {
            orderId,
            merchantId,
            buyer = {},
            shippingDetails = {},
            items = [],
            discountPercent = 0,
            discountAmount = 0,
            taxableValue = 0,
            subtotal,
            gst,
            grandTotal,
        } = req.body;

        // If order was already finalized/created, prevent duplicate number allocation and return existing order
        if (orderId) {
            const existingOrder = await prisma.order.findUnique({
                where: { id: Number(orderId) },
                include: {
                    merchant: true,
                    items: true,
                },
            });
            if (existingOrder) {
                return res.json(existingOrder);
            }
        }

        // 1. Validate merchant
        const mid = Number(merchantId);
        if (!mid) {
            return res.status(400).json({
                message: "Please select a registered merchant."
            });
        }

        const merchant = await prisma.merchant.findUnique({
            where: { id: mid }
        });

        if (!merchant) {
            return res.status(400).json({
                message: "Selected merchant not found in database."
            });
        }

        // 2. Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Please add at least one product row."
            });
        }

        for (const item of items) {
            if (!item.product || !item.product.trim()) {
                return res.status(400).json({
                    message: "Product name is required for all item rows."
                });
            }
            if (!item.quantity || Number(item.quantity) <= 0) {
                return res.status(400).json({
                    message: `Invalid quantity for product "${item.product}". Must be greater than 0.`
                });
            }
        }

        // 3. Atomically allocate sequential invoice number and create order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const { invoice } = await allocateInvoiceNumber(tx);
            console.log("🔥 [Admin Manual Invoice] GENERATED INVOICE:", invoice);

            return await tx.order.create({
                data: {
                    invoice,
                    merchantId: merchant.id,

                    subtotal: Number(subtotal) || 0,
                    gst: Number(gst) || 0,
                    grandTotal: Number(grandTotal) || 0,

                    discountPercent: Number(discountPercent || 0),
                    discountAmount: Number(discountAmount || 0),
                    taxableAmount: Number(taxableValue || (Number(subtotal) - Number(discountAmount || 0)) || 0),

                    state: buyer.merchantState || merchant.state || "Karnataka",
                    placeOfSupply: buyer.merchantPlaceOfSupply || buyer.merchantState || merchant.state || "Karnataka",

                    status: "Pending",
                    paymentStatus: "Pending",

                    // Order Details
                    deliveryNote: shippingDetails.deliveryNote || "",
                    buyersOrderNo: shippingDetails.buyersOrderNo || "",
                    remarks: shippingDetails.remarks || "",
                    supplierRef: shippingDetails.supplierRef || "",
                    dispatchDocumentNo: shippingDetails.dispatchDocumentNo || "",
                    deliveryPartner: shippingDetails.dispatchedThrough || shippingDetails.deliveryPartner || "",
                    transporterName: shippingDetails.transporterName || "",
                    vehicleNumber: shippingDetails.vehicleNumber || "",
                    destination: shippingDetails.destination || "",
                    lrNumber: shippingDetails.lrNumber || "",
                    termsOfDelivery: shippingDetails.termsOfDelivery || "",

                    // Buyer Details (use entered/edited details or fall back to merchant master)
                    shippingAddress: buyer.merchantAddress || merchant.address || "",
                    contactPerson: buyer.merchantContactPerson || merchant.contactPerson || merchant.ownerName || "",
                    phone: buyer.merchantMobile || merchant.phone || "",
                    gstNumber: buyer.merchantGST || merchant.gstNumber || "",

                    items: {
                        create: items.map((item) => ({
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
                    merchant: true,
                    items: true
                }
            });
        });

        res.json(order);
    } catch (err) {
        console.error("CREATE MANUAL ORDER ERROR:", err);
        res.status(500).json({
            message: err.message || "Failed to create manual invoice"
        });
    }
};

// ===========================
// GET NEXT INVOICE NUMBER (FOR PREVIEW)
// ===========================
export const getNextInvoiceNumberHandler = async (req, res) => {
    try {
        const nextInvoice = await getNextInvoiceNumber();
        res.json(nextInvoice);
    } catch (err) {
        console.error("GET NEXT INVOICE NUMBER ERROR:", err);
        res.status(500).json({
            message: err.message || "Failed to get next invoice number"
        });
    }
};
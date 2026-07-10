import prisma from "../config/prisma.js";

export const getCreditNotes = async (req, res) => {

    try {

        const notes = await prisma.creditNote.findMany({

            include: {

                merchant: true

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(notes);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

export const getMerchantCreditNotes = async (req, res) => {

    try {

        const merchantId = Number(req.params.id);

        const notes = await prisma.creditNote.findMany({

            where: {

                merchantId

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(notes);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

export const createCreditNote = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        console.log("=================================");
        console.log("Requested Order ID:", orderId);

        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        });

        console.log("Order Found:", order);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                orderId
            });
        }

        const existing = await prisma.creditNote.findUnique({
            where: {
                orderId
            }
        });

        console.log("Existing Credit Note:", existing);

        if (existing) {
            return res.status(400).json({
                message: "Credit Note already exists",
                creditNote: existing
            });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const credit = await prisma.creditNote.create({
            data: {
                orderId: order.id,
                merchantId: order.merchantId,
                invoice: order.invoice,
                amount: order.grandTotal,
                paidAmount: 0,
                balance: order.grandTotal,
                dueDate,
                status: "Pending"
            }
        });

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                paymentStatus: "Credit"
            }
        });

        console.log("Credit Note Created Successfully");

        res.json({
            message: "Credit Note Created",
            credit
        });

    } catch (err) {
        console.log("CREATE CREDIT ERROR");
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

export const markCreditPaid = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const note = await prisma.creditNote.findUnique({

            where: {

                id

            }

        });

        if (!note)

            return res.status(404).json({

                message: "Credit Note not found"

            });

        const updated = await prisma.creditNote.update({

    where:{ id },

    data:{

        paidAmount: note.amount,

        balance:0,

        status:"Paid"

    }

});

await prisma.order.update({

    where:{

        id: note.orderId

    },

    data:{

        paymentStatus:"Paid"

    }

});

        res.json(updated);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};
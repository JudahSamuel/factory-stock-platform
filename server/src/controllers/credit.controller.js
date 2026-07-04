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
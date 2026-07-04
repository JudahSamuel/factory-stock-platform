import prisma from "../config/prisma.js";

export const getInvoice = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const order = await prisma.order.findUnique({

            where: {

                id

            },

            include: {

                merchant: true,

                items: true

            }

        });

        if (!order) {

            return res.status(404).json({

                message: "Invoice not found"

            });

        }

        res.json(order);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
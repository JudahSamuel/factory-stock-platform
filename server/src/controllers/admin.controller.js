import prisma from "../config/prisma.js";

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

            deliveryPartner,

            vehicleNumber,

            dispatchDate,

            expectedDate,

            deliveredDate

        } = req.body;

        const order = await prisma.order.update({

    where: {

        id

    },

    data: {

        deliveryPartner: deliveryPartner ?? "",

        vehicleNumber: vehicleNumber ?? "",

        dispatchDate: dispatchDate
            ? new Date(dispatchDate)
            : null,

        expectedDate: expectedDate
            ? new Date(expectedDate)
            : null,

        deliveredDate: deliveredDate
            ? new Date(deliveredDate)
            : null

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
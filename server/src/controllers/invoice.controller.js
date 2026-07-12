import prisma from "../config/prisma.js";

export const getInvoice = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const order = await prisma.order.findUnique({
            where: { id },
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

        const products = await prisma.product.findMany({
            select: {
                product: true,
                hsn: true
            }
        });

        const hsnMap = {};

        products.forEach((p) => {
            hsnMap[p.product.trim()] = p.hsn;
        });

        order.items = order.items.map((item) => ({
            ...item,
            hsn: hsnMap[item.product.trim()] || "-"
        }));

        console.log("PRODUCT MAP:", hsnMap);
        console.log("ORDER ITEMS:", order.items);

        return res.json(order);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        });
    }
};
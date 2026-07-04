import prisma from "../config/prisma.js";

export const getAnalytics = async (req, res) => {

    try {

        // ==========================================
        // Basic Counts
        // ==========================================

        const totalProducts = await prisma.product.count();

        const totalMerchants = await prisma.merchant.count();

        const totalOrders = await prisma.order.count();

        const pendingOrders = await prisma.order.count({

            where: {

                status: "Pending"

            }

        });

        const deliveredOrders = await prisma.order.count({

            where: {

                status: "Delivered"

            }

        });

        // ==========================================
        // Revenue (Only Paid Orders)
        // ==========================================

        const revenueResult = await prisma.order.aggregate({

            _sum: {

                grandTotal: true

            },

            where: {

                paymentStatus: "Paid"

            }

        });

        const revenue = revenueResult._sum.grandTotal || 0;

        // ==========================================
        // Inventory Value
        // ==========================================

        const inventory = await prisma.product.findMany();

        const inventoryValue = inventory.reduce(

            (sum, item) =>

                sum + (item.stock * item.price),

            0

        );

        // ==========================================
        // Fetch Orders
        // ==========================================

        const orders = await prisma.order.findMany({

            include: {

                merchant: true,

                items: true

            },

            orderBy: {

                createdAt: "asc"

            }

        });

        // ==========================================
        // Monthly Revenue
        // ==========================================

        const revenueMap = {};

        orders.forEach(order => {

            const month = new Date(order.createdAt).toLocaleString(

                "en-IN",

                {

                    month: "short"

                }

            );

            revenueMap[month] =

                (revenueMap[month] || 0)

                +

                order.grandTotal;

        });

        const monthlyRevenue =

            Object.entries(revenueMap).map(

                ([month, revenue]) => ({

                    month,

                    revenue

                })

            );

        // ==========================================
        // Monthly Orders
        // ==========================================

        const orderMap = {};

        orders.forEach(order => {

            const month = new Date(order.createdAt).toLocaleString(

                "en-IN",

                {

                    month: "short"

                }

            );

            orderMap[month] =

                (orderMap[month] || 0)

                +

                1;

        });

        const monthlyOrders =

            Object.entries(orderMap).map(

                ([month, orders]) => ({

                    month,

                    orders

                })

            );

        // ==========================================
        // Top Products
        // ==========================================

        const productMap = {};

        orders.forEach(order => {

            order.items.forEach(item => {

                productMap[item.product] =

                    (productMap[item.product] || 0)

                    +

                    item.quantity;

            });

        });

        const topProducts =

            Object.entries(productMap)

                .map(

                    ([product, quantity]) => ({

                        product,

                        quantity

                    })

                )

                .sort(

                    (a, b) =>

                        b.quantity - a.quantity

                )

                .slice(0, 5);

        // ==========================================
        // Top Merchants
        // ==========================================

        const merchantMap = {};

        orders.forEach(order => {

            merchantMap[order.merchant.shopName] =

                (merchantMap[order.merchant.shopName] || 0)

                +

                order.grandTotal;

        });

        const topMerchants =

            Object.entries(merchantMap)

                .map(

                    ([merchant, revenue]) => ({

                        merchant,

                        revenue

                    })

                )

                .sort(

                    (a, b) =>

                        b.revenue - a.revenue

                )

                .slice(0, 5);

        // ==========================================
        // Category Wise Inventory
        // ==========================================

        const categoryMap = {};

        inventory.forEach(item => {

            categoryMap[item.category] =

                (categoryMap[item.category] || 0)

                +

                item.stock;

        });

        const categoryInventory =

            Object.entries(categoryMap).map(

                ([category, stock]) => ({

                    category,

                    stock

                })

            );

        // ==========================================
        // Response
        // ==========================================

        res.json({

            totalProducts,

            totalMerchants,

            totalOrders,

            pendingOrders,

            deliveredOrders,

            revenue,

            inventoryValue,

            monthlyRevenue,

            monthlyOrders,

            topProducts,

            topMerchants,

            categoryInventory

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
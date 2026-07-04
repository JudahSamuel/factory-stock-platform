import prisma from "../config/prisma.js";

export const getProducts = async (req, res) => {

    try {

        const products = await prisma.product.findMany({
            orderBy: {
                product: "asc"
            }
        });

        res.json(products);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

};
console.log("NEW PRODUCT CONTROLLER LOADED");
export const uploadProducts = async (req, res) => {

    try {

        const products = req.body.products;

        if (!Array.isArray(products)) {

            return res.status(400).json({
                message: "Invalid product list"
            });

        }

        // Clear old inventory
        await prisma.product.deleteMany();

        // Insert fresh inventory
        await prisma.product.createMany({

            data: products.map(item => ({

                product: item.product,

                category: item.category,

                stock: Number(item.stock),

                unit: item.unit,

                price: Number(item.price),

                gst: Number(item.gst || 0),

                hsn: String(item.hsn || "")

            })),

            skipDuplicates: true

        });

        res.json({

            success: true,

            message: "Products uploaded successfully"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};
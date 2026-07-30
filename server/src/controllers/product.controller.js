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

        console.log("Products received from frontend:");
console.table(products);
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

export const addProduct = async (req, res) => {

    try {

        const {
            product,
            category,
            stock,
            unit,
            price,
            gst,
            hsn
        } = req.body;

        if (!product) {
            return res.status(400).json({
                message: "Product name is required"
            });
        }

        const newProduct = await prisma.product.create({

            data: {

                product,

                category,

                stock: Number(stock),

                unit,

                price: Number(price),

                gst: Number(gst || 0),

                hsn: String(hsn || "")

            }

        });

        res.status(201).json({

            success: true,

            product: newProduct

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

export const updateStock = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const { stock } = req.body;

        const product = await prisma.product.update({

            where: {
                id
            },

            data: {
                stock: Number(stock)
            }

        });

        res.json(product);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerMerchant = async (req, res) => {

    try {

        const {
            shopName,
            ownerName,
            gstNumber,
            email,
            phone,
            password
        } = req.body;

        const existingMerchant = await prisma.merchant.findFirst({

            where: {

                OR: [

                    { email },

                    { gstNumber }

                ]

            }

        });

        if (existingMerchant) {

            return res.status(400).json({

                message: "Merchant already exists."

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Merchant
        const merchant = await prisma.merchant.create({

            data: {

                shopName,
                ownerName,
                gstNumber,
                email,
                phone,
                password: hashedPassword,
                approved: false

            }

        });

        // Create Admin Notification
        try {

    await prisma.notification.create({

        data: {

            title: "New Merchant Registration",

            message: `${merchant.shopName} has requested approval.`,

            role: "ADMIN"

        }

    });

    console.log("✅ Notification Created");

}
catch(err){

    console.log("❌ Notification Error");

    console.log(err);

}

        res.status(201).json({

            message: "Registration successful. Awaiting admin approval."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

export const loginMerchant = async (req, res) => {

    try {

        const { email, password } = req.body;

        const merchant = await prisma.merchant.findUnique({

            where: {

                email

            }

        });

        if (!merchant) {

            return res.status(404).json({

                message: "Merchant not found"

            });

        }

        if (!merchant.approved) {

            return res.status(403).json({

                message: "Your account is awaiting admin approval."

            });

        }

        const valid = await bcrypt.compare(

            password,

            merchant.password

        );

        if (!valid) {

            return res.status(401).json({

                message: "Invalid password"

            });

        }

        const token = jwt.sign(

            {

                merchantId: merchant.id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.json({

            token,

            merchant

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
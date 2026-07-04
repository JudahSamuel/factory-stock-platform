import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "Unauthorized"
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(

            token,
            process.env.JWT_SECRET

        );

        req.admin = decoded;

        next();

    }

    catch (err) {

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};

export const verifyMerchant = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "Unauthorized"
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(

            token,
            process.env.JWT_SECRET

        );

        req.merchant = decoded;

        next();

    }

    catch (err) {

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};
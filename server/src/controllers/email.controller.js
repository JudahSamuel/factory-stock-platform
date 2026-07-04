import prisma from "../config/prisma.js";
import transporter from "../config/mailer.js";

export const sendInvoiceEmail = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const order = await prisma.order.findUnique({

            where: {

                id

            },

            include: {

                merchant: true

            }

        });
        console.log("EMAIL ORDER:", {
    deliveryPartner: order.deliveryPartner,
    vehicleNumber: order.vehicleNumber,
    dispatchDate: order.dispatchDate,
    expectedDate: order.expectedDate
});

        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }

        const invoiceLink =
            `${process.env.CLIENT_URL}/invoice/${order.id}`;

        await transporter.sendMail({

            from: `"Lasya Enterprises" <${process.env.EMAIL_USER}>`,

            to: order.merchant.email,

            subject: `Invoice ${order.invoice}`,

            html: `

<div style="font-family:Arial;padding:30px;background:#f5f5f5">

<div style="max-width:700px;margin:auto;background:white;padding:40px;border-radius:12px">

<h1 style="color:#1f2937">

LASYA ENTERPRISES

</h1>

<p>Hello <b>${order.merchant.ownerName}</b>,</p>

<p>

Your invoice has been generated successfully.

</p>

<table style="width:100%;margin-top:25px">

<tr>

<td><b>Invoice</b></td>

<td>${order.invoice}</td>

</tr>

<tr>

<td><b>Order Status</b></td>

<td>${order.status}</td>

</tr>

<tr>

<td><b>Payment Status</b></td>

<td>${order.paymentStatus}</td>

</tr>

<tr>

<td><b>Grand Total</b></td>

<td>

₹${order.grandTotal.toFixed(2)}

</td>

</tr>

<tr>
<td><b>Delivery Partner</b></td>
<td>${order.deliveryPartner || "-"}</td>
</tr>

<tr>
<td><b>Vehicle Number</b></td>
<td>${order.vehicleNumber || "-"}</td>
</tr>

<tr>
<td><b>Dispatch Date</b></td>
<td>
${
    order.dispatchDate
        ? new Date(order.dispatchDate).toLocaleDateString("en-IN")
        : "-"
}
</td>
</tr>

<tr>
<td><b>Expected Delivery</b></td>
<td>
${
    order.expectedDate
        ? new Date(order.expectedDate).toLocaleDateString("en-IN")
        : "-"
}
</td>
</tr>

</table>

<div style="margin-top:35px">

<a

href="${invoiceLink}"

style="

background:#2563eb;

padding:14px 28px;

color:white;

text-decoration:none;

border-radius:8px;

font-weight:bold;

"

>

View Invoice

</a>

</div>

<p style="margin-top:40px">

Thank you for choosing

<b>Lasya Enterprises</b>.

</p>

<hr>

<p style="font-size:13px;color:#666">

This is an automated email.

</p>

</div>

</div>

`

        });

        res.json({

            success: true,

            message: "Invoice email sent."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
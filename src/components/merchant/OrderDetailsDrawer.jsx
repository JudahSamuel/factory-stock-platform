import { motion, AnimatePresence } from "framer-motion";

export default function OrderDetailsDrawer({

    order,

    onClose,

}) {

    return (

        <AnimatePresence>

            {

                order && (

                    <motion.div

                        initial={{opacity:0}}

                        animate={{opacity:1}}

                        exit={{opacity:0}}

                        className="fixed inset-0 bg-black/30 z-50"

                        onClick={onClose}

                    >

                        <motion.div

                            initial={{x:500}}

                            animate={{x:0}}

                            exit={{x:500}}

                            transition={{duration:0.3}}

                            onClick={(e)=>e.stopPropagation()}

                            className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl p-8"

                        >

                            <h1 className="text-3xl font-bold mb-6">

                                Order Details

                            </h1>

                            <p><b>Invoice :</b> {order.invoice}</p>

                            <p className="mt-3">

                                <b>Merchant :</b>

                                {order.merchant}

                            </p>

                            <p className="mt-3">

                                <b>Products :</b>

                                {order.products}

                            </p>

                            <p className="mt-3">

                                <b>Amount :</b>

                                ₹{order.amount}

                            </p>

                            <p className="mt-3">

                                <b>Status :</b>

                                {order.status}

                            </p>

                            <hr className="my-6"/>

                            <h2 className="font-semibold">

                                Order Timeline

                            </h2>

                            <ul className="mt-4 space-y-3">

                                <li>✅ Order Placed</li>

                                <li>📦 Packed</li>

                                <li>🚚 Shipped</li>

                                <li>🏠 Delivered</li>

                            </ul>

                        </motion.div>

                    </motion.div>

                )

            }

        </AnimatePresence>

    );

}
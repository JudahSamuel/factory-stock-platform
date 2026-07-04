import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import AnimatedButton from "../AnimatedButton";

export default function CartSummary({

    expanded,
    setExpanded,

    selectedItems,

    subtotal,

    gstTotal,

    grandTotal,

    handleCheckout,

}) {

    return (

        <AnimatePresence>

            {expanded ? (

                <motion.div

                    initial={{
                        opacity: 0,
                        scale: 0.8,
                        y: 40,
                    }}

                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}

                    exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: 40,
                    }}

                    transition={{
                        duration: 0.25,
                    }}

                    className="fixed bottom-24 right-6 w-72 bg-white rounded-3xl shadow-2xl overflow-hidden z-40"

                >

                    {/* Header */}

                    <div

                        onClick={() => setExpanded(false)}

                        className="bg-blue-600 text-white p-4 cursor-pointer flex items-center gap-3"

                    >

                        <FaShoppingCart size={22} />

                        <h2 className="text-xl font-bold">

                            Cart Summary

                        </h2>

                    </div>

                    {/* Body */}

                    <div className="p-5">

                        <div className="flex justify-between mb-4">

                            <span>Total Items</span>

                            <b>{selectedItems.length}</b>

                        </div>

                        <div className="flex justify-between mb-3">

                            <span>Subtotal</span>

                            <b>₹{subtotal.toFixed(2)}</b>

                        </div>

                        <div className="flex justify-between mb-3">

                            <span>GST</span>

                            <b>₹{gstTotal.toFixed(2)}</b>

                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-xl font-bold">

                            <span>Total</span>

                            <span>

                                ₹{grandTotal.toFixed(2)}

                            </span>

                        </div>

                        <AnimatedButton

                            onClick={handleCheckout}

                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex justify-center items-center gap-3 text-lg"

                        >

                            Proceed Checkout

                            <FaArrowRight />

                        </AnimatedButton>

                    </div>

                </motion.div>

            ) : (

                <motion.button

                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}

                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}

                    exit={{
                        opacity: 0,
                        scale: 0.7,
                    }}

                    whileHover={{
                        scale: 1.08,
                    }}

                    whileTap={{
                        scale: 0.95,
                    }}

                    onClick={() => setExpanded(true)}

                    className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center z-40"

                >

                    <FaShoppingCart size={26} />

                    {selectedItems.length > 0 && (

                        <span

                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"

                        >

                            {selectedItems.length}

                        </span>

                    )}

                </motion.button>

            )}

        </AnimatePresence>

    );

}
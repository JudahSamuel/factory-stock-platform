import { AnimatePresence, motion } from "framer-motion";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { createPortal } from "react-dom";
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
    if (!expanded) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[999999] flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                    onClick={() => setExpanded(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Bottom Sheet */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 28,
                    }}
                    className="
                        relative
                        w-full
                        max-w-2xl
                        rounded-t-[32px]
                        bg-white/90
                        backdrop-blur-3xl
                        border-t
                        border-white/40
                        shadow-[0_-20px_60px_rgba(0,0,0,0.18)]
                        overflow-hidden
                    "
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-14 h-1.5 rounded-full bg-slate-300" />
                    </div>

                    {/* Header */}
                    <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                <FaShoppingCart size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Cart Summary
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {selectedItems.length} item
                                    {selectedItems.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setExpanded(false)}
                            className="
                                w-10
                                h-10
                                rounded-full
                                hover:bg-slate-100
                                transition
                                text-slate-600
                                text-xl
                            "
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        <div className="flex justify-between text-slate-600">
                            <span>Total Items</span>
                            <span className="font-semibold">
                                {selectedItems.length}
                            </span>
                        </div>

                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">
                                ₹{subtotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between text-slate-600">
                            <span>GST</span>
                            <span className="font-semibold">
                                ₹{gstTotal.toFixed(2)}
                            </span>
                        </div>

                        <hr />

                        <div className="flex justify-between items-center text-2xl font-bold">
                            <span>Total</span>
                            <span className="text-blue-600">
                                ₹{grandTotal.toFixed(2)}
                            </span>
                        </div>

                        <AnimatedButton
                            onClick={handleCheckout}
                            className="
                                w-full
                                mt-4
                                rounded-2xl
                                bg-gradient-to-r
                                from-blue-600
                                to-blue-500
                                hover:from-blue-700
                                hover:to-blue-600
                                text-white
                                py-4
                                text-lg
                                font-semibold
                                shadow-xl
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >
                            Proceed to Checkout
                            <FaArrowRight />
                        </AnimatedButton>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
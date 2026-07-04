import { motion } from "framer-motion";
import { buttonHover } from "../animations/variants";

export default function AnimatedButton({
    children,
    className,
    ...props
}) {
    return (
        <motion.button
            whileHover={buttonHover.whileHover}
            whileTap={buttonHover.whileTap}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
}
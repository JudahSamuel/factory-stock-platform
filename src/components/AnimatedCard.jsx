import { motion } from "framer-motion";
import { cardVariants } from "../animations/variants";

export default function AnimatedCard({
  children,
  index = 0
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
    y:-8,
    scale:1.02,
    boxShadow:
    "0px 20px 35px rgba(37,99,235,.18)"
}}
    >
      {children}
    </motion.div>
  );
}
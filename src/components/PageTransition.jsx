import { motion } from "framer-motion";

export default function PageTransition({ children }) {

    return (

        <motion.div

            initial={{
    opacity:0,
    scale:0.985,
    y:18,
    filter:"blur(6px)"
}}

animate={{
    opacity:1,
    scale:1,
    y:0,
    filter:"blur(0px)"
}}

exit={{
    opacity:0,
    scale:0.985,
    y:-18,
    filter:"blur(6px)"
}}
            transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1]
            }}

            className="w-full h-full"

        >

            {children}

        </motion.div>

    );

}
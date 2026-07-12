import { motion } from "framer-motion";

export default function Loader({

    text = "Loading..."

}) {

    return (

        <div className="flex flex-col items-center justify-center gap-4 py-6">

            <motion.div

                animate={{

                    rotate: 360

                }}

                transition={{

                    repeat: Infinity,

                    duration: 0.8,

                    ease: "linear"

                }}

                className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full"

            />

            <p className="text-gray-600 font-medium">

                {text}

            </p>

        </div>

    );

}
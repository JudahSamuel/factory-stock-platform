import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/lasya-logo.jpeg";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

export default function Home() {

    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (

        <div
            className="
            min-h-screen
            flex
            items-center
            justify-center
            relative
            overflow-hidden
            bg-gradient-to-br
            from-stone-100
            via-amber-50
            to-yellow-100
            px-4
        "
        >

            {/* Language Toggle */}

            <div className="absolute top-6 right-6 z-50">

    <LanguageToggle/>

</div>

            {/* Background Blob 1 */}

            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="
                absolute
                top-0
                left-0
                w-[500px]
                h-[500px]
                bg-yellow-300/20
                rounded-full
                blur-3xl
                "
            />

            {/* Background Blob 2 */}

            <motion.div
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="
                absolute
                bottom-0
                right-0
                w-[500px]
                h-[500px]
                bg-amber-400/20
                rounded-full
                blur-3xl
                "
            />

            {/* Main Card */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="
                bg-white/75
                backdrop-blur-xl
                border
                border-white/50
                rounded-[32px]
                shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]
                p-10
                w-full
                max-w-xl
                relative
                z-10
                "
            >

                {/* Logo */}

                <div className="flex justify-center mb-6">

                    <div className="relative">

                        <div
                            className="
                            absolute
                            inset-0
                            rounded-full
                            bg-yellow-300/20
                            blur-2xl
                            scale-125
                            "
                        />

                        <motion.img
                            src={logo}
                            alt="Lasya Enterprises"
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                duration: 1,
                            }}
                            className="
                            relative
                            w-40
                            h-40
                            rounded-full
                            object-cover
                            border-4
                            border-white
                            shadow-2xl
                            "
                        />

                    </div>

                </div>

                {/* Heading */}

                <h1 className="text-5xl font-bold text-center text-slate-900">

                    LASYA ENTERPRISES

                </h1>

                <p className="text-center text-amber-700 font-semibold tracking-[4px] uppercase mt-2">

                    {t("erp")}

                </p>

                <p className="text-center text-gray-600 mt-4 mb-10 text-lg">

                    {t("subtitle")}

                </p>

                {/* Buttons */}

                <div className="space-y-5">

                    <Link to="/merchant-login">

                        <button
                            className="
                            w-full
                            py-4
                            rounded-2xl
                            text-white
                            font-semibold
                            text-lg
                            shadow-lg
                            bg-gradient-to-r
                            from-slate-700
                            to-slate-600
                            "
                        >

                            {t("merchantPortal")}

                        </button>

                    </Link>

                    <Link to="/admin-login">

                        <button
                            className="
                            w-full
                            py-4
                            rounded-2xl
                            text-black
                            font-semibold
                            text-lg
                            shadow-lg
                            bg-gradient-to-r
                            from-yellow-400
                            to-amber-300
                            "
                        >

                            {t("adminPortal")}

                        </button>

                    </Link>

                </div>

                {/* Footer */}

                <div className="mt-10 pt-6 border-t border-gray-200 text-center">

                    <p className="text-sm text-gray-500">

                        {t("footer1")}

                    </p>

                    <p className="text-xs text-gray-400 mt-2">

                        {t("footer2")}

                    </p>

                </div>

            </motion.div>

        </div>

    );

}
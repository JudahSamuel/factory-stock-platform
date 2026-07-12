import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import splashDesktop from "../assets/splash-desktop.mp4";
import splashMobile from "../assets/splash-mobile.mp4";

export default function SplashScreen({ onFinish }) {

    const videoRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);

    // Detect mobile devices
    const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(orientation: portrait)").matches;
    const splashVideo = isMobile
        ? splashMobile
        : splashDesktop;

    useEffect(() => {

        const video = videoRef.current;

        if (!video) return;

        video.play().catch(() => {});

        const handleEnd = () => {

            setFadeOut(true);

            setTimeout(() => {

                onFinish();

            }, 600);

        };

        video.addEventListener("ended", handleEnd);

        return () => {

            video.removeEventListener("ended", handleEnd);

        };

    }, [onFinish]);

    return (

        <AnimatePresence>

            {!fadeOut && (

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
                >

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain bg-black"
                    >
                        <source
                            src={splashVideo}
                            type="video/mp4"
                        />
                    </video>

                </motion.div>

            )}

        </AnimatePresence>

    );

}
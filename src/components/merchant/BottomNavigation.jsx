import {
  FaHome,
  FaShoppingCart,
  FaUserCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function BottomNavigation({
  active,
  setActive,
  cartCount,
}) {
  const tabs = [
    {
      id: "home",
      icon: <FaHome />,
      label: "Home",
    },
    {
      id: "cart",
      icon: <FaShoppingCart />,
      label: "Cart",
      badge: cartCount,
    },
    {
      id: "account",
      icon: <FaUserCircle />,
      label: "Account",
    },
  ];

  return createPortal(
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 22,
      }}
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[999999]
        flex
        justify-center
        pointer-events-none
        pb-4
      "
    >
      <nav
  className="
    pointer-events-auto

    w-full
    max-w-4xl

    mx-5
    mb-5

    rounded-[30px]

    bg-white/25
    backdrop-blur-[35px]

    border
    border-white/40

    shadow-[0_20px_60px_rgba(0,0,0,0.18)]

    px-8
    py-4

    flex
    justify-around
    items-center

    transition-all
    duration-300
  "
>
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              whileTap={{ scale: 0.92 }}
              animate={
  isActive
    ? {
        y: -8,
        scale: 1.08,
      }
    : {
        y: 0,
        scale: 1,
      }
}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 20,
              }}
              className="
                relative
                flex
                flex-col
                items-center
                cursor-pointer
                select-none
              "
            >
              <div
                className={`
                  w-12
                  h-12
                  rounded-2xl

                  flex
                  items-center
                  justify-center

                  transition-all
                  duration-300

                  ${
                    isActive
  ? "bg-white/60 backdrop-blur-xl border border-white/70 text-blue-600 shadow-lg"
  : "text-slate-500 hover:bg-white/30"
                  }
                `}
              >
                {tab.icon}
              </div>

              {tab.badge > 0 && (
                <span
                  className="
                    absolute
                    top-0
                    right-0

                    min-w-5
                    h-5
                    px-1

                    rounded-full

                    bg-red-500

                    text-white
                    text-[10px]
                    font-bold

                    flex
                    items-center
                    justify-center
                  "
                >
                  {tab.badge}
                </span>
              )}

              <span
                className={`
                  mt-2
                  text-xs
                  font-medium
                  transition-colors

                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-500"
                  }
                `}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>,
    document.body
  );
}
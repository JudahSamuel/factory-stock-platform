import {
  FaHome,
  FaShoppingCart,
  FaUserCircle,
} from "react-icons/fa";

import { motion } from "framer-motion";

export default function BottomNavigation({

  active,

  setActive,

  cartCount,

}) {

  const tabs = [

    {
      id: "home",
      icon: <FaHome size={22} />,
      label: "Home",
    },

    {
      id: "cart",
      icon: <FaShoppingCart size={22} />,
      label: "Cart",
      badge: cartCount,
    },

    {
      id: "account",
      icon: <FaUserCircle size={22} />,
      label: "Account",
    },

  ];

  return (

    <motion.div

      initial={{ y: 120, opacity: 0 }}

      animate={{ y: 0, opacity: 1 }}

      transition={{

        duration: 0.6,

        type: "spring",

        stiffness: 120,

      }}

      className="

      fixed

      bottom-5

      left-1/2

      -translate-x-1/2

      z-[999]

      bg-white/90

      backdrop-blur-xl

      border

      border-white/40

      shadow-[0_20px_50px_rgba(0,0,0,0.18)]

      rounded-full

      px-6

      py-3

      flex

      items-center

      justify-center

      gap-10

      w-[320px]

      max-w-[92vw]

      "

    >

      {tabs.map((tab) => (

        <button

          key={tab.id}

          onClick={() => setActive(tab.id)}

          className="

          relative

          flex

          flex-col

          items-center

          justify-center

          transition-all

          duration-300

          "

        >

          {/* Active Circle */}

          {active === tab.id && (

            <motion.div

              layoutId="activeTab"

              className="

              absolute

              -top-2

              w-12

              h-12

              rounded-full

              bg-blue-100

              "

              transition={{

                type: "spring",

                stiffness: 350,

                damping: 25,

              }}

            />

          )}

          {/* Icon */}

          <motion.div

            animate={

              active === tab.id

                ? {

                    scale: 1.2,

                    y: -6,

                  }

                : {

                    scale: 1,

                    y: 0,

                  }

            }

            transition={{

              duration: 0.25,

            }}

            className={`

            relative

            z-10

            ${

              active === tab.id

                ? "text-blue-600"

                : "text-gray-500"

            }

            `}

          >

            {tab.icon}

          </motion.div>

          {/* Badge */}

          {tab.badge > 0 && (

            <motion.span

              initial={{ scale: 0 }}

              animate={{ scale: 1 }}

              transition={{

                type: "spring",

                stiffness: 250,

              }}

              className="

              absolute

              top-0

              right-0

              bg-red-500

              text-white

              text-[10px]

              rounded-full

              w-5

              h-5

              flex

              items-center

              justify-center

              z-20

              "

            >

              {tab.badge}

            </motion.span>

          )}

          {/* Label */}

          <motion.span

            animate={{

              opacity: active === tab.id ? 1 : 0.7,

            }}

            className={`

            text-xs

            mt-2

            font-medium

            relative

            z-10

            ${

              active === tab.id

                ? "text-blue-600"

                : "text-gray-500"

            }

            `}

          >

            {tab.label}

          </motion.span>

        </button>

      ))}

    </motion.div>

  );

}
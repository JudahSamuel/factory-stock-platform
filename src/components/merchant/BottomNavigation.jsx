import {
  FaHome,
  FaShoppingCart,
  FaUserCircle,
} from "react-icons/fa";

export default function BottomNavigation({

  active,

  setActive,

  cartCount,

}) {

  return (

    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-full px-8 py-4 flex gap-12 border z-50">

      <button
        onClick={() => setActive("home")}
        className={`flex flex-col items-center ${
          active === "home"
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        <FaHome size={22}/>
        <span className="text-xs mt-1">
          Home
        </span>
      </button>

      <button
        onClick={() => setActive("cart")}
        className={`relative flex flex-col items-center ${
          active === "cart"
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        <FaShoppingCart size={22}/>

        {cartCount > 0 && (

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">

            {cartCount}

          </span>

        )}

        <span className="text-xs mt-1">
          Cart
        </span>

      </button>

      <button
        onClick={() => setActive("account")}
        className={`flex flex-col items-center ${
          active === "account"
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        <FaUserCircle size={22}/>
        <span className="text-xs mt-1">
          Account
        </span>
      </button>

    </div>

  );

}
import AnimatedButton from "../AnimatedButton";

export default function AccountDrawer({

  open,

  navigate,

  onClose,

}) {

  if (!open) return null;

  const merchant = JSON.parse(

    localStorage.getItem("merchant") || "null"

  );

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("merchant");

    navigate("/merchant-login");

  };

  return (

    <div

      className="fixed inset-0 bg-black/30 z-40"

      onClick={onClose}

    >

      <div

        onClick={(e) => e.stopPropagation()}

        className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl p-6"

      >

        {/* Merchant Info */}

        <div className="border-b pb-5 mb-5">

          <h2 className="text-2xl font-bold">

            {merchant?.shopName || "Merchant"}

          </h2>

          <p className="text-gray-500">

            {merchant?.ownerName}

          </p>

          <p className="text-sm text-gray-400 mt-1">

            {merchant?.email}

          </p>

        </div>

        <button

          onClick={() => {

            onClose();

            navigate("/my-orders");

          }}

          className="w-full text-left py-3 hover:text-blue-600 transition"

        >

          📦 My Orders

        </button>

        <button

          onClick={() => {

            onClose();

            navigate("/deliveries");

          }}

          className="w-full text-left py-3 hover:text-blue-600 transition"

        >

          🚚 Deliveries

        </button>

        <button

          onClick={() => {

            onClose();

            navigate("/credit-notes");

          }}

          className="w-full text-left py-3 hover:text-blue-600 transition"

        >

          💳 Credit Notes

        </button>

        <button

          onClick={() => {

            onClose();

            navigate("/merchant-profile");

          }}

          className="w-full text-left py-3 hover:text-blue-600 transition"

        >

          ⚙ Profile

        </button>

        <button

          onClick={handleLogout}

          className="w-full text-left py-3 text-red-600 hover:text-red-700 transition"

        >

          🚪 Logout

        </button>

      </div>

    </div>

  );

}
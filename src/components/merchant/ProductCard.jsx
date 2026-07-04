import AnimatedCard from "../AnimatedCard";
import AnimatedButton from "../AnimatedButton";
import StatusBadge from "../common/StatusBadge";

import {
  FaMinus,
  FaPlus,
  FaBoxes,
  FaRupeeSign,
  FaPercent,
} from "react-icons/fa";

export default function ProductCard({

  item,

  quantity,

  increaseQty,

  decreaseQty,

  addToCart


}) {

  return (

    <AnimatedCard>

      <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100">

        {/* Product Header */}

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              📦 {item.product}

            </h2>

            <p className="text-gray-500 mt-1">

              {item.category}

            </p>

          </div>

          <StatusBadge stock={item.stock}/>

        </div>

        {/* Divider */}

        <div className="border-t my-5"/>

        {/* Product Details */}

        <div className="grid grid-cols-2 gap-4">

          <div>

            <p className="text-gray-500 text-sm">

              Price

            </p>

            <p className="font-bold text-lg flex items-center gap-1">

              <FaRupeeSign/>

              {item.price}

            </p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">

              GST

            </p>

            <p className="font-bold text-lg flex items-center gap-1">

              <FaPercent/>

              {item.gst}%

            </p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">

              Available

            </p>

            <p className="font-bold text-lg">

              {item.stock} {item.unit}

            </p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">

              HSN

            </p>

            <p className="font-bold text-lg">

              {item.hsn || "-"}

            </p>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t my-5"/>

        {/* Quantity */}

        <div className="flex justify-center items-center gap-5">

          <AnimatedButton

            onClick={()=>decreaseQty(item)}

            className="w-11 h-11 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center"

          >

            <FaMinus/>

          </AnimatedButton>

          <div className="text-3xl font-bold w-12 text-center">

            {quantity}

          </div>

          <AnimatedButton

            onClick={()=>increaseQty(item)}

            className="w-11 h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center"

          >

            <FaPlus/>

          </AnimatedButton>

          
        </div>

        <AnimatedButton

onClick={()=>addToCart(item)}

className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl"

>

🛒 Add To Cart

</AnimatedButton>


        {/* Quantity Info */}

        <p className="text-center text-gray-400 text-sm mt-3">

          Select quantity to purchase

        </p>

      </div>

    </AnimatedCard>

  );

}
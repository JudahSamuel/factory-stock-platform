import AnimatedCard from "../AnimatedCard";
import {
    FaClipboardList,
    FaTruck,
    FaCheckCircle,
    FaRupeeSign
} from "react-icons/fa";

export default function OrderAnalytics({

    totalOrders,

    pending,

    delivered,

    totalAmount

}) {

    const cards = [

        {
            title: "Orders",
            value: totalOrders,
            color: "from-blue-600 to-blue-500",
            icon: <FaClipboardList size={26}/>
        },

        {
            title: "Pending",
            value: pending,
            color: "from-yellow-500 to-yellow-400",
            icon: <FaTruck size={26}/>
        },

        {
            title: "Delivered",
            value: delivered,
            color: "from-green-600 to-green-500",
            icon: <FaCheckCircle size={26}/>
        },

        {
            title: "Purchase",
            value: `₹${totalAmount}`,
            color: "from-purple-600 to-purple-500",
            icon: <FaRupeeSign size={24}/>
        }

    ];

    return (

        <div className="grid lg:grid-cols-4 gap-5 mb-8">

            {

                cards.map((card,index)=>(

                    <AnimatedCard key={index} index={index}>

                        <div className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 text-white shadow-lg`}>

                            {card.icon}

                            <h3 className="mt-4">

                                {card.title}

                            </h3>

                            <h1 className="text-4xl font-bold">

                                {card.value}

                            </h1>

                        </div>

                    </AnimatedCard>

                ))

            }

        </div>

    );

}
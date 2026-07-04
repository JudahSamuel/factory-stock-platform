import AnimatedCard from "../AnimatedCard";
import OrderStatus from "./OrderStatus";
import { FaEye, FaFilePdf } from "react-icons/fa";

export default function OrdersTable({

    orders,

    setSelectedOrder,

    downloadInvoice,

}) {

    return (

        <AnimatedCard>

            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full">

                    <thead>

                        <tr className="bg-slate-100">

                            <th className="p-4 text-left">Invoice</th>

                            <th className="p-4 text-left">Merchant</th>

                            <th className="p-4 text-left">Products</th>

                            <th className="p-4 text-left">Amount</th>

                            <th className="p-4 text-left">Status</th>

                            <th className="p-4 text-center">Invoice</th>

                            <th className="p-4 text-center">Details</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            orders.map((order)=>(

                                <tr
                                    key={order.id}
                                    className="border-t hover:bg-slate-50 transition"
                                >

                                    <td className="p-4 font-semibold">
                                        {order.invoice}
                                    </td>

                                    <td className="p-4">
                                        {order.merchant}
                                    </td>

                                    <td className="p-4">
                                        {order.products}
                                    </td>

                                    <td className="p-4">
                                        ₹{order.amount.toLocaleString()}
                                    </td>

                                    <td className="p-4">

                                        <OrderStatus
                                            status={order.status}
                                        />

                                    </td>

                                    <td className="p-4 text-center">

                                        <button

                                            onClick={()=>downloadInvoice(order)}

                                            className="text-red-600 hover:text-red-700"

                                        >

                                            <FaFilePdf size={20}/>

                                        </button>

                                    </td>

                                    <td className="p-4 text-center">

                                        <button

                                            onClick={()=>setSelectedOrder(order)}

                                            className="text-blue-600 hover:text-blue-700"

                                        >

                                            <FaEye size={20}/>

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </AnimatedCard>

    );

}
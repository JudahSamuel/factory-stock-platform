import AnimatedCard from "../AnimatedCard";
import {
 FaBoxes,
 FaWarehouse


} from "react-icons/fa";

export default function AnalyticsCards({

 totalProducts,

 totalStock,

}) {

 return (

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

<AnimatedCard index={0}>

<div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white p-6 shadow-lg">

<FaBoxes size={30}/>

<h3 className="mt-4">

Products

</h3>

<h1 className="text-4xl font-bold">

{totalProducts}

</h1>

</div>

</AnimatedCard>

<AnimatedCard index={1}>

<div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl text-white p-6 shadow-lg">

<FaWarehouse size={30}/>

<h3 className="mt-4">

Stock

</h3>

<h1 className="text-4xl font-bold">

{totalStock}

</h1>

</div>

</AnimatedCard>


</div>

 );

}
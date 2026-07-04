export default function StatusBadge({

stock

}){

if(stock<=0){

return(

<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">

Out of Stock

</span>

);

}

if(stock<=25){

return(

<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">

Low Stock

</span>

);

}

return(

<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

Available

</span>

);

}   
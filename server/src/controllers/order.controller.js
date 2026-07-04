import prisma from "../config/prisma.js";

export const createOrder = async (req,res)=>{

try{

const {

merchantId,

subtotal,

gst,

grandTotal,

buyer,

shippingDetails,

items

} = req.body;
console.log("Shipping Details Received:", shippingDetails);

const invoice="INV"+Date.now();

const order=await prisma.order.create({

data:{

invoice,

merchantId,

subtotal,

gst,

grandTotal,

state: buyer.merchantState,

placeOfSupply: buyer.merchantPlaceOfSupply,

status:"Pending",

paymentStatus:"Pending",

deliveryNote: shippingDetails.deliveryNote,

supplierRef: shippingDetails.supplierRef,

otherReference: shippingDetails.otherReference,

dispatchDocumentNo:
    shippingDetails.dispatchDocumentNo,

termsOfDelivery:
    shippingDetails.termsOfDelivery,

// Buyer Details

shippingAddress: buyer.merchantAddress,

contactPerson: buyer.merchantContactPerson,

phone: buyer.merchantMobile,

// Shipping Details

deliveryPartner: shippingDetails.transportMode,

vehicleNumber: shippingDetails.vehicleNumber,

remarks: shippingDetails.termsOfDelivery,

items:{

create:items.map(item=>({

product:item.product,

quantity:item.quantity,

rate:item.rate,

gst:item.gstRate,

amount:item.quantity*item.rate

}))

}

},

include:{

items:true

}

});

res.json(order);

}

catch(err){

console.log(err);

res.status(500).json({

message:err.message

});

}

};

export const getOrders=async(req,res)=>{

const merchantId=Number(req.params.id);

const orders=await prisma.order.findMany({

where:{merchantId},

include:{items:true},

orderBy:{createdAt:"desc"}

});

res.json(orders);

};
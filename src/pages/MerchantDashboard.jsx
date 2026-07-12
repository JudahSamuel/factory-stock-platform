import { useState, useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/merchant/BottomNavigation";
import AccountDrawer from "../components/merchant/AccountDrawer";

import { getProducts } from "../api/product";
import AnimatedPage from "../components/AnimatedPage";

import MerchantHeader from "../components/merchant/MerchantHeader";
import AnalyticsCards from "../components/merchant/AnalyticsCards";
import SearchFilter from "../components/merchant/SearchFilter";
import ProductCard from "../components/merchant/ProductCard";
import CartSummary from "../components/merchant/CartSummary";

export default function MerchantDashboard() {

    const navigate = useNavigate();

    const [inventory,setInventory]=useState([]);

    const [search,setSearch]=useState("");

    const [category,setCategory]=useState("All");

    const [quantities,setQuantities]=useState({});
    const [cartItems,setCartItems]=useState([]);

    const [active,setActive]=useState("home");
    const [cartExpanded,setCartExpanded]=useState(false);

    const [accountOpen,setAccountOpen]=useState(false);

    const merchant = JSON.parse(
    localStorage.getItem("merchant") || "null"
);

useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        navigate("/merchant-login");

        return;

    }

}, [navigate]);

    useEffect(() => {

    loadProducts();

}, []);

const loadProducts = async () => {

    try {

        const response = await getProducts();

        console.table(response.data);
setInventory(response.data);

    }

    catch(error){

        console.error(error);

    }

};

    const categories=useMemo(()=>{

        return [

            "All",

            ...new Set(

                inventory.map(

                    item=>item.category

                )

            )

        ];

    },[inventory]);

    const filteredInventory=inventory.filter(item=>{

        const productMatch=item.product

        ?.toLowerCase()

        .includes(search.toLowerCase());

        const categoryMatch=

        category==="All"

        ||

        item.category===category;

        return productMatch && categoryMatch;

    });

    const increaseQty=(item)=>{

        const current=

        quantities[item.product] || 0;

        if(current>=item.stock) return;

        setQuantities(prev=>({

            ...prev,

            [item.product]:current+1

        }));

    };

    const decreaseQty=(item)=>{

        const current=

        quantities[item.product] || 0;

        if(current<=0) return;

        setQuantities(prev=>({

            ...prev,

            [item.product]:current-1

        }));

    };

    const addToCart = (item) => {
        console.log("PRODUCT FROM INVENTORY");
console.log(item);

    const qty =
        quantities[item.product] || 0;

    if(qty===0){

        alert("Select quantity first");

        return;

    }

    const exists =
        cartItems.find(

            p=>p.product===item.product

        );

    if(exists){

        setCartItems(prev=>

            prev.map(p=>

                p.product===item.product

                ? {

                    ...p,

                    quantity:qty

                }

                : p

            )

        );

    }

    else{

        setCartItems(prev=>[

            ...prev,

            {
    product: item.product,

    quantity: qty,

    rate: item.price,

    gstRate: Number(item.gst || 0),

    hsn: item.hsn,

    unit: item.unit,

    category: item.category,

    stock: item.stock
}

        ]);

    }

};

    const selectedItems = cartItems;

    const subtotal = selectedItems.reduce(

    (sum, item) =>

        sum +

        item.quantity * Number(item.rate),

    0

);
    const gstTotal = selectedItems.reduce(

    (sum, item) =>

        sum +

        (Number(item.rate) *
            Number(item.quantity) *
            Number(item.gstRate || 0)) / 100,

    0

);

    const grandTotal = subtotal + gstTotal;
    const totalProducts=

    inventory.length;

    const totalStock=

    inventory.reduce(

        (sum,item)=>

        sum+

        Number(item.stock || 0),

        0

    );

    const inventoryValue = inventory.reduce(

    (sum, item) =>

        sum +

        Number(item.stock || 0) *

        Number(item.price || 0),

    0

);

    



    const handleCheckout = () => {

    if (selectedItems.some(item => item.quantity <= 0)) {
        alert("Invalid quantity");
        return;
    }

    if (selectedItems.length === 0) {
        alert("Please select products");
        return;
    }

    navigate("/checkout", {
        state: {
            items: selectedItems
        }
    });

};

    return (

    <>

        <AnimatedPage>

            <div className="min-h-screen bg-slate-100 pb-36">

                <MerchantHeader
                    navigate={navigate}
                    merchant={merchant}
                />

                <div className="max-w-7xl mx-auto p-8">

                    <AnalyticsCards
                        totalProducts={totalProducts}
                        totalStock={totalStock}
                    />

                    <SearchFilter
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                        categories={categories}
                    />

                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 pb-40">

                        {filteredInventory.map(item => (

                            <ProductCard
                                key={item.id}
                                item={item}
                                quantity={quantities[item.product] || 0}
                                increaseQty={increaseQty}
                                decreaseQty={decreaseQty}
                                addToCart={addToCart}
                            />

                        ))}

                    </div>

                </div>

                <CartSummary
                    expanded={cartExpanded}
                    setExpanded={setCartExpanded}
                    selectedItems={selectedItems}
                    subtotal={subtotal}
                    gstTotal={gstTotal}
                    grandTotal={grandTotal}
                    handleCheckout={handleCheckout}
                />

            </div>

        </AnimatedPage>

        <AccountDrawer
            open={accountOpen}
            navigate={navigate}
            onClose={() => setAccountOpen(false)}
        />

        <BottomNavigation
            active={active}
            setActive={(tab) => {

                setActive(tab);

                if (tab === "home") {

                    setAccountOpen(false);
                    setCartExpanded(false);

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

                if (tab === "cart") {

                    setAccountOpen(false);
                    setCartExpanded(prev => !prev);

                }

                if (tab === "account") {

                    setCartExpanded(false);
                    setAccountOpen(true);

                }

            }}
            cartCount={selectedItems.length}
        />

    </>

);
}
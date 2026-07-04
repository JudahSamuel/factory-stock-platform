import AnimatedButton from "../AnimatedButton";

export default function MerchantHeader({

    navigate,

    merchant

}) {

    return (

        <div className="bg-white shadow-sm border-b">

            <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

                <div>

                    <h1 className="text-4xl font-bold text-slate-800">

                        Merchant Dashboard

                    </h1>

                    <p className="text-gray-500 mt-2 text-lg">

                        Welcome,

                        <span className="font-semibold text-slate-800">

                            {" "}

                            {merchant?.shopName || "Merchant"}

                        </span>

                        👋

                    </p>

                </div>

            </div>

        </div>

    );

}
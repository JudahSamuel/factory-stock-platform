import AnimatedPage from "../components/AnimatedPage";

export default function MerchantProfile() {

    const merchant = JSON.parse(
        localStorage.getItem("merchant")
    );

    if (!merchant) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex items-center justify-center">
                    <h2 className="text-2xl font-bold">
                        Merchant not found
                    </h2>
                </div>
            </AnimatedPage>
        );
    }

    return (

        <AnimatedPage>

            <div className="min-h-screen bg-slate-100 p-10">

                <h1 className="text-4xl font-bold mb-8">

                    👤 Merchant Profile

                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl">

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-gray-500">
                                Shop Name
                            </p>

                            <h2 className="text-xl font-semibold">
                                {merchant.shopName}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Owner Name
                            </p>

                            <h2 className="text-xl font-semibold">
                                {merchant.ownerName}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                GST Number
                            </p>

                            <h2 className="text-lg">
                                {merchant.gstNumber || "-"}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Email
                            </p>

                            <h2 className="text-lg">
                                {merchant.email}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Phone
                            </p>

                            <h2 className="text-lg">
                                {merchant.phone || "-"}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                State
                            </p>

                            <h2 className="text-lg">
                                {merchant.state || "-"}
                            </h2>

                        </div>

                        <div className="md:col-span-2">

                            <p className="text-gray-500">
                                Address
                            </p>

                            <h2 className="text-lg">
                                {merchant.address || "-"}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

        </AnimatedPage>

    );

}
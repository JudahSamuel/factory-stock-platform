import AnimatedPage from "../components/AnimatedPage";

export default function MerchantProfile(){

    return(

        <AnimatedPage>

            <div className="min-h-screen bg-slate-100 p-10">

                <h1 className="text-4xl font-bold">

                    👤 Merchant Profile

                </h1>

                <div className="mt-8 bg-white rounded-2xl p-8 shadow">

                    <p><b>Name :</b> Patel Commercial</p>

                    <p className="mt-4"><b>GSTIN :</b> 29ABCDE1234F1Z5</p>

                    <p className="mt-4"><b>Phone :</b> **********</p>

                    <p className="mt-4"><b>Email :</b> *********@gmail.com</p>

                </div>

            </div>

        </AnimatedPage>

    );

}
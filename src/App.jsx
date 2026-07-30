import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import FactoryLogin from "./pages/FactoryLogin";
import MerchantLogin from "./pages/MerchantLogin";
import AdminLogin from "./pages/AdminLogin";
import Deliveries from "./pages/Deliveries";
import MerchantProfile from "./pages/MerchantProfile";
import MerchantRegister from "./pages/MerchantRegister";
import MerchantApprovals from "./pages/MerchantApprovals";
import SplashScreen from "./pages/SplashScreen";
import Merchants from "./pages/Merchants";
import MerchantDetails from "./pages/MerchantDetails";
import MerchantCreditNotes from "./pages/MerchantCreditNotes";

import FactoryDashboard from "./pages/FactoryDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrdersDashboard from "./pages/OrdersDashboard";
import Checkout from "./pages/Checkout";
import InvoicePreview from "./pages/InvoicePreview";
import AdminOrders from "./pages/AdminOrders";
import Analytics from "./pages/Analytics";
import CreditNotes from "./pages/CreditNotes";
import MyOrders from "./pages/MyOrders";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedMerchantRoute from "./components/ProtectedMerchantRoute";

function AnimatedRoutes() {

    const location = useLocation();

    const Animated = (element) => (

        <PageTransition>

            {element}

        </PageTransition>

    );

    return (

        <AnimatePresence mode="wait">

            <Routes location={location} key={location.pathname}>

                {/* Public */}

                <Route path="/" element={Animated(<Home />)} />

                <Route path="/factory-login" element={Animated(<FactoryLogin />)} />

                <Route path="/merchant-login" element={Animated(<MerchantLogin />)} />

                <Route path="/admin-login" element={Animated(<AdminLogin />)} />

                <Route path="/merchant-register" element={Animated(<MerchantRegister />)} />

                {/* Admin */}

                <Route

                    path="/admin-dashboard"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <AdminDashboard />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                <Route

                    path="/factory-dashboard"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <FactoryDashboard />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                <Route
  path="/merchant-credit-notes"
  element={<MerchantCreditNotes />}
/>

                <Route

                    path="/admin-orders"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <AdminOrders />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                <Route
    path="/merchant/:id"
    element={
        Animated(
            <ProtectedAdminRoute>
                <MerchantDetails />
            </ProtectedAdminRoute>
        )
    }
/>

                

                

                <Route

                    path="/merchant-approvals"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <MerchantApprovals />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                <Route
    path="/merchants"
    element={
        Animated(
            <ProtectedAdminRoute>
                <Merchants />
            </ProtectedAdminRoute>
        )
    }
/>

                <Route

                    path="/analytics"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <Analytics />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                <Route

                    path="/credit-notes"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <CreditNotes />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                <Route

                    path="/deliveries"

                    element={

                        Animated(

                            <ProtectedAdminRoute>

                                <Deliveries />

                            </ProtectedAdminRoute>

                        )

                    }

                />

                {/* Merchant */}

                <Route

                    path="/merchant-dashboard"

                    element={

                        Animated(

                            <ProtectedMerchantRoute>

                                <MerchantDashboard />

                            </ProtectedMerchantRoute>

                        )

                    }

                />

                <Route

                    path="/checkout"

                    element={

                        Animated(

                            <ProtectedMerchantRoute>

                                <Checkout />

                            </ProtectedMerchantRoute>

                        )

                    }

                />

                <Route

                    path="/merchant-profile"

                    element={

                        Animated(

                            <ProtectedMerchantRoute>

                                <MerchantProfile />

                            </ProtectedMerchantRoute>

                        )

                    }

                />

                <Route

                    path="/my-orders"

                    element={

                        Animated(

                            <ProtectedMerchantRoute>

                                <MyOrders />

                            </ProtectedMerchantRoute>

                        )

                    }

                />

                <Route

                    path="/invoice/:id"

                    element={

                        Animated(

                            <ProtectedMerchantRoute>

                                <InvoicePreview />

                            </ProtectedMerchantRoute>

                        )

                    }

                />

                <Route

                    path="/orders"

                    element={Animated(<OrdersDashboard />)}

                />

            </Routes>

        </AnimatePresence>

    );

}

export default function App() {

    // Toggle this when you want the intro back
    const SHOW_SPLASH = false;

    const [showSplash, setShowSplash] = useState(SHOW_SPLASH);

    return (

        <BrowserRouter>

            <AnimatePresence mode="wait">

                {
                    showSplash ? (
                        <SplashScreen
                            onFinish={() => setShowSplash(false)}
                        />
                    ) : (
                        <AnimatedRoutes />
                    )
                }

            </AnimatePresence>

        </BrowserRouter>

    );

}
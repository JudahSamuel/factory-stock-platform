import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import FactoryLogin from "./pages/FactoryLogin";
import MerchantLogin from "./pages/MerchantLogin";
import AdminLogin from "./pages/AdminLogin";
import Deliveries from "./pages/Deliveries";
import MerchantProfile from "./pages/MerchantProfile";
import MerchantRegister from "./pages/MerchantRegister";
import MerchantApprovals from "./pages/MerchantApprovals";

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

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/factory-login"
                    element={<FactoryLogin />}
                />

                <Route
                    path="/merchant-login"
                    element={<MerchantLogin />}
                />

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/merchant-register"
                    element={<MerchantRegister />}
                />

                {/* Admin */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboard />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/factory-dashboard"
                    element={
                        <ProtectedAdminRoute>
                            <FactoryDashboard />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/admin-orders"
                    element={
                        <ProtectedAdminRoute>
                            <AdminOrders />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/merchant-approvals"
                    element={
                        <ProtectedAdminRoute>
                            <MerchantApprovals />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedAdminRoute>
                            <Analytics />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/credit-notes"
                    element={
                        <ProtectedAdminRoute>
                            <CreditNotes />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/deliveries"
                    element={
                        <ProtectedAdminRoute>
                            <Deliveries />
                        </ProtectedAdminRoute>
                    }
                />

                {/* Merchant */}

                <Route
                    path="/merchant-dashboard"
                    element={
                        <ProtectedMerchantRoute>
                            <MerchantDashboard />
                        </ProtectedMerchantRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedMerchantRoute>
                            <Checkout />
                        </ProtectedMerchantRoute>
                    }
                />

                <Route
                    path="/merchant-profile"
                    element={
                        <ProtectedMerchantRoute>
                            <MerchantProfile />
                        </ProtectedMerchantRoute>
                    }
                />

                <Route
                    path="/my-orders"
                    element={
                        <ProtectedMerchantRoute>
                            <MyOrders />
                        </ProtectedMerchantRoute>
                    }
                />

                <Route
                    path="/invoice/:id"
                    element={
                        <ProtectedMerchantRoute>
                            <InvoicePreview />
                        </ProtectedMerchantRoute>
                    }
                />

                {/* Other */}

                <Route
                    path="/orders"
                    element={<OrdersDashboard />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
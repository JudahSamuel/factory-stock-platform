import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import FactoryLogin from "./pages/FactoryLogin";
import MerchantLogin from "./pages/MerchantLogin";
import AdminLogin from "./pages/AdminLogin";

import FactoryDashboard from "./pages/FactoryDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

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
          path="/factory-dashboard"
          element={<FactoryDashboard />}
        />

        <Route
          path="/merchant-dashboard"
          element={<MerchantDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
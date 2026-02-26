import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import VerifyPass from "./pages/VerifyPass";
import ResetPass from "./pages/ResetPassword";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/mainlayout.jsx";
import Step1 from "./pages/dashboard/Live/current/Step1.jsx";
import Step2 from "./pages/dashboard/Live/current/Step2.jsx";
import Step3 from "./pages/dashboard/Live/current/Step3.jsx";
import BankTransfer from "./pages/dashboard/Live/current/BankTransfer.jsx";
import Rules from "./pages/dashboard/Live/current/Rules.jsx";
import Success from "./pages/dashboard/Live/current/Success.jsx";

import "./style.css";

function App() {
  return (
    <>
      <Routes>
        {/* TODO */}
        <Route index element={<Signin />} />
        <Route path="/Home" element={<LandingPage />} />
        <Route path="/SignUp" element={<Signup />} />
        <Route path="/Verify" element={<VerifyPass />} />
        <Route path="/ResetPass" element={<ResetPass />} />
        {/* Dashboard shell */}
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/Live" element={<MainLayout />}>
          <Route index element={<Step1 />} />
          <Route path="step1" element={<Step1 />} />
          <Route path="step2" element={<Step2 />} />
          <Route path="step3" element={<Step3 />} />
          <Route path="bank-transfer" element={<BankTransfer />} />
          <Route path="rules" element={<Rules />} />
          <Route path="success" element={<Success />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import VerifyPass from "./pages/VerifyPass";
import ResetPass from "./pages/ResetPassword";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";

import "./style.css";

function App() {
  return (
    <>
      <Routes>
        {/* TODO */}
        <Route index element={<LandingPage />} />
        <Route path="/SignUp" element={<Signup />} />
        <Route path="/Verify" element={<VerifyPass />} />
        <Route path="/SignIn" element={<Signin />} />
        <Route path="/ResetPass" element={<ResetPass />} />
        {/* Dashboard shell */}
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

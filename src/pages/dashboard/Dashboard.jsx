import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroStackSlider from "../../components/common/HeroStackSlider";
import "../../style.css";
import { http } from "../../server/http";

function Dashboard() {
  // TODO_FIX_pageTitle
  // useEffect(() => {
  //   document.title = "Dashboard";
  // }, []);

  const SLIDES = Array.from(Array(3).keys())

  return (
    <>
      <div className="text-base h-screen flex flex-col gap-4 text-white font-semibold text-center">
        <HeroStackSlider /> 
        <div className="in-gradient-border gradient-border h-99/100 w-1/5 mt-px py-3 px-0.5 flex flex-col gap-4 bg-blue-50/4 rounded-4xl left-1 ">
          <Link className="relative z-30 block" to="/Support">support</Link>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

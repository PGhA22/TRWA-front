import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroStackSlider from "../../components/common/HeroStackSlider";
import VideoBox from "../../components/ui/VideoBox";
import "../../style.css";
import { http } from "../../server/http";

import misionVideo from "../../assets/vid/mission.mp4";

function Dashboard() {
  // TODO_FIX_pageTitle
  // useEffect(() => {
  //   document.title = "Dashboard";
  // }, []);

  const SLIDES = Array.from(Array(3).keys());

  return (
    <>
      <div className="w-[89.8%] mx-auto flex flex-col text-white">
        <div className="box-dashboard mt-23 pb-4 pt-1 bg-blue-200/5 backdrop-blur-2xl">
          <h5 className="p-6 pl-[5%]">Select your goal to progress forward</h5>
          <div className="box-dashboard w-9/10 mx-auto flex justify-center">
            <div className="w-195 flex justify-center">
              <HeroStackSlider />
            </div>
          </div>
        </div>
        {/* <div className="in-gradient-border gradient-border h-99/100 w-1/5 mt-px py-3 px-0.5 flex flex-col gap-4 bg-blue-50/4 rounded-4xl left-1 ">
        </div> */}
        <div className="mt-4 flex gap-9">
          <div className=" w-63/100 aspect-63/32 px-5.5 pt-4.5 box-dashboard bg-blue-200/5 backdrop-blur-2xl relative overflow-hidden">
            <div className="bg-wolf absolute inset-0 opacity-30"></div>
            <div>
              <h6 className="font-bold">Your Progress</h6>
              <p className="mt-2 text-xs">Track your growth and consistency</p>
              <div className="mt-11.5 flex justify-between items-end">
                <p className="font-bold text-xl">
                  Level <span>4</span> | <span>Wolf</span>
                </p>
                <div>
                  <span>2,675 </span>XP / <span>3,200 </span>XP
                </div>
              </div>
              {/* progres bar */}
              <div className="w-full h-3 mt-2.5 bg-white/20 rounded-full">
                <div
                  className="h-full rounded-full bg-[radial-gradient(ellipse_120%_180%_at_50%_50%,#ffffff_0%,#40b7ff_20%,#103365_40%,#103365_100%)]"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="mt-9 grid-cols-2 grid gap-y-5">
                <div>
                  <span>3</span> Courses Completed
                </div>
                <div>
                  <span>12</span> Current Streak
                </div>
                <div>
                  <span>2</span> Active Challenges
                </div>
                <div>
                  <span>2</span> Groups Joined
                </div>
              </div>
              <div className="mt-6 flex">
                <Link className="font-semibold"> View Detailed Progress</Link>
              </div>
            </div>
          </div>
          <div className="box-horizontal w-42/100 aspect-63/32 px-3.5 pt-4.5 pb-4 bg-blue-200/5 backdrop-blur-2xl flex flex-col justify-around">
            <h6 className="2xl:px-1">Current Mission</h6>
            <div>
              <VideoBox src={misionVideo} title="Phase 1 - Module 5" />
            </div>
          </div>
        </div>
        <div className="mt-4 w-full h-px bg-white/20"></div>
      </div>
    </>
  );
}

export default Dashboard;

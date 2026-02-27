import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroStackSlider from "../../components/common/HeroStackSlider";
import VideoBox from "../../components/ui/VideoBox";
import "../../style.css";
import { http } from "../../server/http";

import misionVideo from "../../assets/vid/mission.mp4";
import profile from "../../assets/images/profile.webp";
import fireIcon from "../../assets/images/fire.webp";
import wolf from "../../assets/images/wolf.webp";

function Dashboard() {
  // TODO_FIX_pageTitle
  // useEffect(() => {
  //   document.title = "Dashboard";
  // }, []);

  const SLIDES = Array.from(Array(3).keys());

  return (
    <>
      <div className="w-[89.8%] mx-auto flex flex-col text-white no-caret">
        <div className="box-dashboard mt-23 pb-4 pt-1 bg-blue-200/5 backdrop-blur-xs">
          <h5 className="p-6 pl-[5%] font-bold">Select your goal to progress forward</h5>
          <div className=" w-9/10 mx-auto flex justify-center">
            <div className="w-195 2xl:w-250 flex justify-center overflow-x-hidden">
              <HeroStackSlider />
            </div>
          </div>
        </div>
        {/* <div className="in-gradient-border gradient-border h-99/100 w-1/5 mt-px py-3 px-0.5 flex flex-col gap-4 bg-blue-50/4 rounded-4xl left-1 ">
        </div> */}
        <div className="mt-4 flex gap-9">
          <div className="w-63/100 aspect-63/32 px-5.5 2xl:px-7.5 pt-4.5 2xl:pt-6.5 box-dashboard bg-blue-200/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-60 bg-cover bg-[center center] -mt-8 brightness-50" style={{ backgroundImage: `url(${wolf})`}}></div>
            <div className="">
              <h6 className="font-bold">Your Progress</h6>
              <p className="mt-2 2xl:mt-4 text-xs">
                Track your growth and consistency
              </p>
              <div className="mt-7 2xl:mt-11.5 flex justify-between items-end">
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
              <div className="2xl:w-160 mt-5 2xl:mt-15 grid-cols-2 grid gap-y-2 2xl:gap-y-5">
                <div className="flex items-center gap-2">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 300 300"
                    className="w-4 h-4 inline"
                  >
                    <path
                      d="M56.54,222.45c-32.41-0.66-49.38-28.92-48.16-50.57c1.2-21.37,18.67-44.94,48.16-45.89c0-1.02,0-2.06,0-3.1   c-0.01-18.56-0.02-37.12-0.03-55.68c0-7.84,2.67-10.53,10.47-10.53c18.56,0.01,37.12,0.02,55.67,0.03c1.14,0,2.28,0,3.31,0   c0.59-4.12,0.85-7.92,1.71-11.58C133,22.32,153.76,7.22,177.8,8.49c21.98,1.16,41.06,19.28,43.93,41.69   c0.27,2.14,0.03,5.03,1.29,6.15c1.21,1.08,4.07,0.35,6.2,0.35c17.1-0.03,34.2,0.08,51.3-0.2c7.44-0.12,11.52,2.52,11.4,11.2   c-0.3,22.06-0.09,44.12-0.1,66.18c0,6.95-4.12,10.32-10.95,9.03c-16.44-3.12-32.7,7.86-36.46,24.64   c-3.67,16.35,6.61,33.24,22.76,37.47c4.98,1.3,9.95,1.27,15.01,0.51c5.76-0.87,9.63,2.55,9.64,8.37c0.03,23.03,0.02,46.06,0,69.09   c-0.01,5.56-3.33,8.85-8.9,8.86c-22.93,0.01-45.86,0.02-68.79,0c-6.24,0-9.7-3.81-8.62-9.9c3.42-19.15-9.49-34.2-24.4-37.53   c-21.83-4.88-42.25,14.43-38.33,36.46c1.28,7.17-1.9,11.01-9.15,11.01c-22.54-0.01-45.08-0.02-67.62-0.04   c-6.5-0.01-9.47-2.91-9.47-9.41c-0.02-18.85,0-37.71,0.01-56.56C56.54,224.8,56.54,223.74,56.54,222.45z"
                      fill="#fff"
                    />
                  </svg>
                  <span className="">3</span>
                  <span>Courses Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={fireIcon}
                    alt="Fire Icon"
                    className="w-4 h-4 inline"
                  />
                  <span>12</span>
                  <span> Current Streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    className="w-4 h-4 inline"
                    fill="#FFB743"
                  >
                    <g xmlns="http://www.w3.org/2000/svg">
                      <path d="M150.04,196.64c-39.95,0-79.89-0.02-119.84,0.05c-2.55,0-3.68-0.41-4.1-3.28   c-3.48-23.54-7.17-47.05-10.79-70.56c-1.87-12.14-3.71-24.29-5.62-36.43c-0.7-4.5,0.63-8.02,4.04-10.18   c3.34-2.12,7.33-1.91,10.92,0.77c17.12,12.81,34.22,25.65,51.31,38.48c7.97,5.99,15.39,4.74,20.92-3.55   c14.24-21.35,28.46-42.72,42.71-64.07c3.59-5.38,8.74-7.7,13.98-5.5c2.69,1.13,5.33,3.38,6.97,5.81   c14.45,21.33,28.69,42.8,42.95,64.26c2.66,4,6.06,6.52,11,6.7c3.63,0.14,6.58-1.33,9.39-3.45c16.69-12.57,33.39-25.11,50.14-37.6   c1.69-1.26,3.59-2.57,5.58-3c6.66-1.44,11.93,4.13,10.84,11.05c-2.51,16.09-4.97,32.19-7.45,48.28   c-3.05,19.76-6.18,39.5-9.09,59.28c-0.39,2.65-1.46,2.99-3.74,2.99C230.13,196.63,190.08,196.64,150.04,196.64z" />
                      <path d="M273.28,217.46c0.07,0.97,0.17,1.82,0.17,2.68c0.01,8.01,0.04,16.02-0.02,24.02   c-0.06,9-5.26,14.14-14.26,14.14c-72.77,0-145.54,0.01-218.31,0c-8.99,0-14.19-5.16-14.24-14.16c-0.04-8.01-0.02-16.02-0.02-24.02   c0-0.85,0.11-1.71,0.17-2.66C109.03,217.46,191.05,217.46,273.28,217.46z" />
                    </g>
                  </svg>
                  <span>2</span>
                  <span> Active Challenges</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    className="w-4 h-4 inline"
                    fill="#FFF"
                  >
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      d="M131.25,0c12.5,0,25,0,37.5,0c0,43.69,0,87.39,0,131.25c44,0,87.63,0,131.25,0c0,12.5,0,25,0,37.5   c-43.69,0-87.39,0-131.25,0c0,44,0,87.63,0,131.25c-12.5,0-25,0-37.5,0c0-43.69,0-87.39,0-131.25c-44,0-87.63,0-131.25,0   c0-12.5,0-25,0-37.5c43.69,0,87.39,0,131.25,0C131.25,87.25,131.25,43.62,131.25,0z"
                    />
                  </svg>
                  <span>2</span>
                  <span> Groups Joined</span>
                </div>
              </div>
              <div className="mt-4 2xl:mt-9 flex items-center gap-2 relative z-10">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 300 300"
                  className="w-4 h-4 inline pointer-events-none"
                  fill="#FFF"
                >
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M0,147.66c2.36-7.03,7.34-9.47,14.61-9.45c80.33,0.13,160.66,0.08,240.99,0.08c1.15,0,2.31,0,4.18,0   c-1.17-1.22-1.91-2.03-2.69-2.8c-12.66-12.61-25.31-25.22-37.98-37.8c-3.44-3.42-4.57-7.49-3.21-12.06   c1.26-4.24,4.25-6.96,8.59-7.95c4.49-1.03,8.21,0.49,11.41,3.68c14.17,14.12,28.37,28.22,42.56,42.33   c5.26,5.23,10.64,10.35,15.71,15.76c2.27,2.43,3.9,5.47,5.83,8.23c0,1.56,0,3.12,0,4.69c-1.92,2.76-3.49,5.88-5.82,8.23   c-19.28,19.37-38.69,38.61-58.08,57.87c-5.17,5.14-11.89,5.62-16.77,1.28c-5.21-4.63-5.36-12.22-0.2-17.38   c12.62-12.64,25.3-25.22,37.97-37.81c0.75-0.74,1.7-1.27,2.56-1.9c-0.15-0.3-0.3-0.61-0.45-0.91c-1.11,0-2.22,0-3.33,0   c-80.43,0-160.85-0.05-241.28,0.08c-7.26,0.01-12.25-2.42-14.61-9.45C0,150.78,0,149.22,0,147.66z"
                  />
                </svg>
                <Link
                  to="/Coming-soon"
                  className="font-semibold relative z-10 pointer-events-auto"
                >
                  View Detailed Progress
                </Link>
              </div>
            </div>
          </div>
          <div className="box-horizontal w-42/100 aspect-63/32 px-3.5 pt-4.5 pb-4 bg-blue-200/5 backdrop-blur-[2px] flex flex-col justify-around">
            <h6 className="2xl:px-1 font-bold">Current Mission</h6>
            <div>
              <VideoBox
                src={misionVideo}
                title="The Real Wolves Academy"
                videoText="PHASE 1 , MODULE 5"
              />
            </div>
          </div>
        </div>
        {/* group */}
        <div className="box-horizontal mt-6 w-105.5 h-fit px-3.5 pb-18 pt-5 bg-blue-200/5 backdrop-blur-xs">
          <div className="flex justify-between pb-3 pl-1 pr-3">
            <div>
              <h6 className="font-bold">My Groups</h6>
              <p className="mt-2 text-xs">Your active communities</p>
            </div>
            <div>
              {/* to="/Groups/MyGroups" */}
              <Link to="/Coming-soon" className="text-xs">
                View All
              </Link>
            </div>
          </div>

          <div>
            <div className="w-full h-18 mt-4 py-3.5 border border-white/20 box-border rounded-[15px] flex justify-between items-end px-6">
              <div className="flex items-center gap-5">
                <img src={profile} alt="Profile" className="w-9 h-9" />
                <div>
                  <h6>Early Risers</h6>
                  <p>Member · New activity</p>
                </div>
              </div>
              <div>
                {/* TODO-link-Discover-group */}
                <Link to={"/Coming-soon"}>
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    className="w-4 h-4 inline pointer-events-none"
                    fill="#FFF"
                  >
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      d="M0,147.66c2.36-7.03,7.34-9.47,14.61-9.45c80.33,0.13,160.66,0.08,240.99,0.08c1.15,0,2.31,0,4.18,0   c-1.17-1.22-1.91-2.03-2.69-2.8c-12.66-12.61-25.31-25.22-37.98-37.8c-3.44-3.42-4.57-7.49-3.21-12.06   c1.26-4.24,4.25-6.96,8.59-7.95c4.49-1.03,8.21,0.49,11.41,3.68c14.17,14.12,28.37,28.22,42.56,42.33   c5.26,5.23,10.64,10.35,15.71,15.76c2.27,2.43,3.9,5.47,5.83,8.23c0,1.56,0,3.12,0,4.69c-1.92,2.76-3.49,5.88-5.82,8.23   c-19.28,19.37-38.69,38.61-58.08,57.87c-5.17,5.14-11.89,5.62-16.77,1.28c-5.21-4.63-5.36-12.22-0.2-17.38   c12.62-12.64,25.3-25.22,37.97-37.81c0.75-0.74,1.7-1.27,2.56-1.9c-0.15-0.3-0.3-0.61-0.45-0.91c-1.11,0-2.22,0-3.33,0   c-80.43,0-160.85-0.05-241.28,0.08c-7.26,0.01-12.25-2.42-14.61-9.45C0,150.78,0,149.22,0,147.66z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="addGroup">
            <div className="w-full h-18 mt-4 py-3.5 border border-white/20 box-border rounded-[15px] flex justify-center items-center px-6">
              <div className="h-3/4 aspect-square rounded-[15px] flex justify-center items-center">
              {/* /Group/DiscoverGroups */}
                <Link to="/Coming-soon">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    className="w-4 h-4 inline"
                    fill="#FFF"
                  >
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      d="M131.25,0c12.5,0,25,0,37.5,0c0,43.69,0,87.39,0,131.25c44,0,87.63,0,131.25,0c0,12.5,0,25,0,37.5   c-43.69,0-87.39,0-131.25,0c0,44,0,87.63,0,131.25c-12.5,0-25,0-37.5,0c0-43.69,0-87.39,0-131.25c-44,0-87.63,0-131.25,0   c0-12.5,0-25,0-37.5c43.69,0,87.39,0,131.25,0C131.25,87.25,131.25,43.62,131.25,0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

import { Link } from "react-router-dom";
import { useState } from "react";
import "../style.css";
// import { http } from "./server/http";

function LandingPage() {
  const [imgSample, setImgSample] = useState(false);
  return (
    <>
      <div className="landingBG">
        {/* Glow */}
        <div className="glow glow1" />
        <div className="glow glow2" />
        <div className="glow glow3" />
        {/* content */}
        <header className="fixed w-full p-1 z-90 bg-white/3 backdrop-blur-md flex items-center-safe justify-around">
          <Link to="/" className="rounded-full">
            <button className="gradient-border px-7 py-3.5 rounded-2xl font-normal text-base cursor-pointer">
              login
            </button>
          </Link>
          <img src="/trwa_logo.png" alt="trwa_logo" style={{ height: 80 }} />
        </header>
        <div className="h-23"></div>
        <div className="w-9/12 mx-auto">
          <div className="box-45 my-10 p-8 flex items-center text-center">
            <div className="flex-1 flex flex-col items-center gap-7 2xl:gap-12">
              <h2 className="text-3xl font-semibold">
                Join the wolves. Build your future
              </h2>
              <p className="text-xl">
                Structured learning. Real challenges. Measurable growth
              </p>
              <Link to="/">
                <button
                  type="button"
                  onMouseEnter={() => setImgSample(true)}
                  onMouseLeave={() => setImgSample(false)}
                  className={`Button w-full max-w-md px-9 py-4 font-extrabold rounded-xl text-2xl`}
                >
                  Claim Your Spot
                </button>
              </Link>
            </div>
            <div className="flex-1 py-2.5 px-3">
              <img
                src="/images/dashboardSample.webp"
                alt="dashboardSample"
                onMouseEnter={() => setImgSample(true)}
                onMouseLeave={() => setImgSample(false)}
                className={[
                  "w-full rounded-2xl transition-all duration-700 ease-out",
                  imgSample
                    ? "grayscale-0 brightness-100 contrast-100 blur-0 opacity-100"
                    : "grayscale brightness-75 contrast-75 blur-2xs opacity-80",
                ].join(" ")}
              />
            </div>
          </div>
          <div className="box-45 mt-10 flex items-center text-center">
            <div className="image-inner-shadow w-full relative">
              <img
                src="/images/Community_growth_gathering__people_participating_in_group_challenges__workshops_.webp"
                alt="Where learning becomes a shared journey"
                className={[
                  "w-full grayscale-25 opacity-90 border-4 border-white select-none",
                ]}
              />
              <div className="absolute bottom-13 2xl:bottom-20 left-0 right-0 z-10 px-6 text-center">
                <h2 className="text-3xl 2xl:text-6xl font-semibold drop-shadow-xl">
                  Where learning becomes a shared journey
                </h2>
              </div>
            </div>
          </div>
          <Link
            to="/"
            className={`Button block w-full mt-2 px-9 py-4 font-extrabold rounded-xl text-2xl text-center`}
          >
            Become part of it
          </Link>
          <div className="text-2xl my-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            voluptas, ea labore dignissimos quia incidunt reiciendis ex
            voluptates necessitatibus sapiente numquam soluta suscipit, minus
            quis ratione saepe beatae provident unde.
          </div>
        </div>
        {/* Footer */}
        <footer className="landingFooter w-full grid place-items-center pb-50">
          <div className="relative flex gap-13 2xl:gap-26 justify-center">
            <div>
              <div className="flex items-end-safe">
                <h2 className="-translate-y-10 translate-x-4 text-xl font-semibold">
                  The Real Wolves Academy
                </h2>
                <img
                  src="/trwa_logo.png"
                  alt="trwa_logo"
                  className="w-44 h-44"
                />
              </div>
              <p className="pl-5 -translate-y-6 w-sm leading-8">
                A structured platform built for discipline, clarity, and
                long-term personal growth
              </p>
            </div>
            <div className="mt-25">
              <h3 className="text-xl font-semibold">PLATFORM</h3>
              <ul className="mt-4 pl-4 list-disc">
                <li>Dashboard</li>
                <li>Programs</li>
                <li>Challenges</li>
                <li>Community</li>
              </ul>
            </div>
            <div className="mt-25 ml-4">
              <h3 className="text-xl font-semibold">LEGAL</h3>
              <ul className="mt-4 pl-4 list-disc">
                <li>Imprint</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="mt-25">
              <h3 className="text-xl font-semibold">CONTACT</h3>
              <ul className="mt-4 pl-4 list-disc">
                <li>support@yourdomain.com</li>
                <li>Berlin, Germany</li>
              </ul>
            </div>
          </div>
          <p className="absolute bottom-6 text-sm inset-x-0 text-center">
            © 2026 The Real Wolves Academy. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;

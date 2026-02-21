import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "../../style.css";
import { Link } from "react-router";

const slides = [
  {
    title: "Sharpen your mind first",
    desc: "Center your attention and eliminate distractions.",
    to: "/Dashboard",
  },
  {
    title: "Start focusing sec",
    desc: "Enter deep focus mode to work with clarity and intent.",
    to: "/Dashboard",
  },
  {
    title: "Build consistency third",
    desc: "Small wins every day compound fast.",
    to: "/Dashboard",
  },
  { title: "Stay on track", desc: "Track your progress and keep momentum.", to: "/Dashboard" },
  { title: "Stay on track", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi, praesentium doloremque sint quae voluptas natus unde provident! Sunt voluptatem iure officiis earum minus repellat fugit, nulla, placeat, cumque similique quis!", to: "/Dashboard" },
];

export default function HeroStackSlider() {
  return (
    <section className="heroStackWrap relative pt-6 pb-10 w-full">
      <div className="heroGlow" />
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        centeredSlides
        loop
        grabCursor
        slidesPerView={"2"}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 20,
          stretch: 50,
          depth: 200,
          modifier: 2,
          slideShadows: false,
        }}
        className="heroSwiper w-full pt-2.5 pb-6"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="heroSlide h-65 flex justify-center content-center">
            <div className="slideInner">
              <div className="glassCard flex flex-col justify-around w-94.5 2xl:w-120 aspect-378/232">
                <h3 className="mb-2 text-2xl font-bold text-center">{s.title}</h3>
                <p className="mb-3.5 font-semibold text-sm leading-5 text-center">{s.desc}</p>

                <Link to={s.to} className="glassBtn font-semibold text-center cursor-pointer" type="button">
                  → Start Focusing 
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

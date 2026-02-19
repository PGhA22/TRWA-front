import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "../../style.css";

const slides = [
  { title: "Sharpen your mind first", desc: "Center your attention and eliminate distractions." },
  { title: "Start focusing sec", desc: "Enter deep focus mode to work with clarity and intent." },
  { title: "Build consistency third", desc: "Small wins every day compound fast." },
  { title: "Stay on track", desc: "Track your progress and keep momentum." },
  { title: "Stay on track", desc: "Track your progress and keep momentum." },
];

export default function HeroStackSlider() {
  return (
    <section className="heroStackWrap">
      <div className="heroGlow" />

      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        centeredSlides
        loop
        grabCursor
        slidesPerView={"auto"}
        autoplay={{ delay: 2200, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 20,
          stretch: 50,
          depth: 200,
          modifier: 2,
          slideShadows: false,
        }}
        className="heroSwiper"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="heroSlide">
            <div className="glassCard">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>

              <button className="glassBtn" type="button">
                Start Focusing →
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

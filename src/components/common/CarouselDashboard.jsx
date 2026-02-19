import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const getSnapList = (api) => {
  // Embla versions differ: snapList() vs scrollSnapList()
  if (typeof api.snapList === "function") return api.snapList();
  if (typeof api.scrollSnapList === "function") return api.scrollSnapList();
  // fallback
  return [];
};

export default function EmblaCarousel({ slides = [], options }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const setTweenNodes = useCallback((api) => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__tween") || slideNode;
    });
  }, []);

  const setTweenFactor = useCallback((api) => {
    const snaps = getSnapList(api);
    tweenFactor.current = TWEEN_FACTOR_BASE * snaps.length;
  }, []);

  const tweenScale = useCallback((api, event) => {
    const engine = api.internalEngine?.();
    const scrollProgress = api.scrollProgress();
    const snaps = getSnapList(api);

    // اگر نسخه‌ت internalEngine نداشت، اینجا graceful می‌شیم
    const slidesInView = typeof api.slidesInView === "function" ? api.slidesInView() : [];
    const isScrollEvent = event?.type === "scroll";

    snaps.forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;

      // اگر internalEngine داریم، grouping + loop fix دقیق میشه
      const slidesInSnap =
        engine?.scrollSnapList?.slidesBySnap?.[snapIndex] ??
        [snapIndex]; // fallback: assume 1 slide per snap

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && slidesInView.length && !slidesInView.includes(slideIndex)) return;

        if (engine?.options?.loop && engine?.slideLooper?.loopPoints) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target?.();
            if (slideIndex === loopItem.index && target && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0.8, 1);

        const tweenNode = tweenNodes.current[slideIndex];
        if (!tweenNode) return;

        tweenNode.style.transform = `scale(${scale})`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    // بعضی نسخه‌ها reInit دارن، بعضیا reinit
    const on = emblaApi.on.bind(emblaApi);
    const off = emblaApi.off.bind(emblaApi);

    const reinitEvent =
      // اگر خواستی خیلی مطمئن باشی هر دو رو ببند:
      null;

    on("reInit", setTweenNodes);
    on("reInit", setTweenFactor);
    on("reInit", tweenScale);
    on("reinit", setTweenNodes);
    on("reinit", setTweenFactor);
    on("reinit", tweenScale);

    on("scroll", tweenScale);
    on("slideFocus", tweenScale);
    on("select", tweenScale);

    return () => {
      off("reInit", setTweenNodes);
      off("reInit", setTweenFactor);
      off("reInit", tweenScale);
      off("reinit", setTweenNodes);
      off("reinit", setTweenFactor);
      off("reinit", tweenScale);

      off("scroll", tweenScale);
      off("slideFocus", tweenScale);
      off("select", tweenScale);
    };
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((s, i) => (
            <div className="embla__slide" key={s?.id ?? i}>
              <div className="embla__slide__tween">
                <div className="embla__slide__number">{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

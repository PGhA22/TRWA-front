import React, { useEffect, useMemo, useState } from "react";
import { useBooking } from "../context/BookingContext";
import "../style.css";

const API_BASE = import.meta.env.VITE_API_BASE || "https://app.therealwolves.com";

function Step1() {
  const { selectedCard, setSelectedCard } = useBooking();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ فرمت یورو (de-DE)
  const formatEUR = useMemo(
    () => (n) =>
      new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(n ?? 0)),
    []
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_BASE}/api/events/`);
        if (!res.ok) throw new Error("Fehler beim Laden der Events.");

        const data = await res.json();
        const now = new Date();

        const mapped = data.map((event) => {
          const eventDate = new Date(event.start_datetime);
          const isInactive = !event.is_active;
          const isFull = (event.remaining_capacity ?? 0) <= 0;
          const isPast = eventDate < now;

          const currentPrice = event.current_price_eur ?? event.price ?? 0;
          const originalPrice = event.original_price_eur ?? null;
          const hasDiscount = !!event.is_discount_active && originalPrice && currentPrice < originalPrice;

          return {
            id: event.id,
            date: eventDate.toLocaleDateString("de-DE"),
            seats: event.remaining_capacity,
            disabled: isInactive || isFull || isPast,

            // ✅ قیمت‌ها
            currentPrice,
            originalPrice,
            hasDiscount,
          };
        });

        setCards(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <>
      {loading && <div className="text-white text-center">Events werden geladen...</div>}
      {error && !loading && <div className="text-red-300 text-center">{error}</div>}

      {!loading && !error && (
        <div className="flex flex-wrap md:max-w-96 mx-auto gap-9 justify-center p-2">
          {cards.map((card) => {
            const isSelected = selectedCard === card.id;
            const isDisabled = card.disabled;

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (!isDisabled) {
                    setSelectedCard((prev) => (prev === card.id ? null : card.id));
                  }
                }}
                className={`
                  w-full h-fit px-8 py-6 flex justify-between rounded-4xl
                  backdrop-blur-sm bg-radial from-60% from-transparent to-black/10
                  ${
                    isSelected && !isDisabled
                      ? "gradient-border-ch"
                      : !isDisabled
                      ? "gradient-border"
                      : "border-0 gradient-border opacity-40 grayscale cursor-not-allowed"
                  }
                `}
              >
                {/* چپ: تاریخ + ظرفیت */}
                <div className="grid gap-2">
                  <h2 className="font-semibold text-xl text-white">{card.date}</h2>
                  <h2 className="font-semibold text-sm text-white/80">
                    Verfügbare Plätze: {card.seats}
                  </h2>

                  {/* ✅ قیمت */}
                  <div className="mt-1">
                    {card.hasDiscount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-white/40 line-through">
                          {formatEUR(card.originalPrice)}
                        </span>
                        <span className="text-lg font-semibold text-white">
                          {formatEUR(card.currentPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-white">
                        {formatEUR(card.currentPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* راست: رادیو */}
                <div className="flex items-center justify-center">
                  <input type="radio" readOnly className="hidden" />
                  <div
                    className={`
                      relative flex items-center justify-center
                      h-6 w-6 rounded-full border-[6px] transition-all duration-300
                      ${
                        isDisabled
                          ? "border-gray-400 bg-gray-600"
                          : isSelected
                          ? "bg-[#4592D5] border-[#4592D5]"
                          : "border-[#4592D5] bg-transparent"
                      }
                    `}
                  >
                    {isSelected && !isDisabled && (
                      <svg className="absolute h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13L9 17L19 7"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Step1;
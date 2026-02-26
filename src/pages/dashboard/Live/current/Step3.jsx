import { useEffect, useState } from "react";
import { useBooking } from "../../../../context/BookingContext";
import "../../../../style.css";
import Paypal from "../../../../assets/paypal.svg";
import Credit from "../../../../assets/credit.svg";
import Trans from "../../../../assets/transaction.svg";

function Step3() {
  const { selectedPayment, setSelectedPayment, selectedCard, eventsMap } = useBooking();
const event = selectedCard ? eventsMap?.[selectedCard] : null;

const currentPrice = event?.current_price_eur ?? event?.price ?? 0;
const originalPrice = event?.original_price_eur ?? null;

const hasDiscount =
  !!event?.is_discount_active &&
  originalPrice !== null &&
  Number(currentPrice) < Number(originalPrice);
const [timeLeft, setTimeLeft] = useState("");

useEffect(() => {
  if (!event?.discount_end || !hasDiscount) {
    setTimeLeft("");
    return;
  }

  const updateTimer = () => {
    const end = new Date(event.discount_end).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      setTimeLeft("Rabatt abgelaufen");
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    } else {
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  return () => clearInterval(interval);
}, [event?.discount_end, hasDiscount]);

  const paymentMethods = [
    { id: "paypal", label: "Paypal / Kreditkarte", icon: Paypal, type: "online" },
    { id: "card_to_card", label: "Karte-zu-Karte", icon: Trans, type: "card_to_card" },
  ];

  return (
    <div className="flex flex-wrap md:max-w-96 mx-auto gap-9 justify-center p-2">
      {event && (
  <div className="w-full px-8 py-6 rounded-4xl backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 gradient-border">
    <div className="">
      {hasDiscount ? (
        <div className="flex items-baseline gap-3">
          <span className="text-red-500/60 text-xl font-semibold line-through">{originalPrice}€</span>
          <span className="text-white text-2xl font-bold">{currentPrice}€</span>
        </div>
      ) : (
        <div className="text-white text-2xl font-bold">{currentPrice}€</div>
      )}
    </div>

    {hasDiscount && timeLeft && (
  <div className="mt-2 text-lg text-white flex items-center gap-2">
    Angebot endet in:<span>{timeLeft}</span>
  </div>
)}
  </div>
)}
      {paymentMethods.map((method) => {
        const isSelected = selectedPayment === method.id;

        return (
          <div
            key={method.id}
            onClick={() => setSelectedPayment(method.id)}
            className={`
              w-full h-fit 
                px-8 py-10 flex justify-between rounded-4xl
                backdrop-blur-sm bg-radial from-60% from-transparent to-black/10
              ${isSelected ? "gradient-border-ch" : "gradient-border"}
            `}
          >
            <div className="flex items-center gap-3">
              <img src={method.icon} alt="" className="w-8 h-8" />
              <h2 className="font-semibold text-base text-white/80">{method.label}</h2>
            </div>

            <div className="flex items-center justify-center">
              <div
                className={`
                    relative flex items-center justify-center
                    h-6 w-6 rounded-full border-[6px] transition-all duration-300
                    ${isSelected ? "bg-[#4592D5] border-[#4592D5]" : "border-[#4592D5] bg-transparent"}
                  `}
              >
                {isSelected && (
                  <svg className="absolute h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Step3;

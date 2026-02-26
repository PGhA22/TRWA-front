import { useBooking } from "../../../../context/BookingContext";
import "../../../../style.css";
import Paypal from "../../../../assets/paypal.svg";
import Credit from "../../../../assets/credit.svg";
import Trans from "../../../../assets/transaction.svg";

function Step3() {
  const { selectedPayment, setSelectedPayment } = useBooking();

  const paymentMethods = [
    { id: "paypal", label: "Paypal / Kreditkarte", icon: Paypal, type: "online" },
    { id: "card_to_card", label: "Karte-zu-Karte", icon: Trans, type: "card_to_card" },
  ];

  return (
    <div className="flex flex-wrap md:max-w-96 mx-auto gap-9 justify-center p-2">
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

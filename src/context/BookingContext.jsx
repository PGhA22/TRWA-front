import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [inputs, setInputs] = useState({
    vorname: "",
    nachname: "",
    telefon: "",
    email: "",
  });

  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <BookingContext.Provider
      value={{
        selectedCard,
        setSelectedCard,
        inputs,
        setInputs,
        selectedPayment,
        setSelectedPayment,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}


export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return ctx;
}

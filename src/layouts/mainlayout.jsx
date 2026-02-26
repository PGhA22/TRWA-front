import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://app.therealwolves.com";

function MainLayout() {
  const { selectedCard, inputs, selectedPayment } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const basePath = "/live";
const inLive = pathname === basePath || pathname.startsWith(basePath + "/");
const livePath = inLive ? pathname.slice(basePath.length) || "/" : pathname;

 const onRules = livePath === "/rules";
const onStep1 = livePath === "/" || livePath === "/step1";
const onStep2 = livePath === "/step2";
const onStep3 = livePath === "/step3";
const onBankTransfer = livePath === "/bank-transfer";
const onPaymentSuccess =
  livePath.includes("payment-success") || livePath.includes("success");

  const buttonLabel = onRules ? "Regeln akzeptieren" : "Weiter";

  const isAllInputsFilled = () =>
    Object.values(inputs || {}).every((v) => (v || "").trim() !== "");

  const handleNext = async () => {
    // ✅ بعد از بانک ترنسفر -> rules
    if (onBankTransfer) {
      const st = location.state || {};
      navigate("rules", {
        state: {
          registrationId: st.registrationId,
          eventId: st.eventId,
        },
      });
      return;
    }

    // ✅ بعد از پرداخت آنلاین برگشتی (success page) -> rules
    if (onPaymentSuccess) {
      navigate("rules");
      return;
    }

    // ✅ rules آخرین مرحله
    if (onRules) {
      // پایان فرآیند (اگر صفحه done داری اینجا عوض کن)
      navigate("/live");
      return;
    }

    // ✅ step1 -> step2
    if (onStep1) {
      if (!selectedCard) {
        alert("Bitte wählen Sie einen Termin aus.");
        return;
      }
      navigate("step2");
      return;
    }

    // ✅ step2 -> step3
    if (onStep2) {
      if (!isAllInputsFilled()) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }
      navigate("step3");
      return;
    }

    // ✅ step3 (registration + payment)
    if (onStep3) {
      if (!isAllInputsFilled() || !selectedCard) {
        alert("Bitte alle Felder ausfüllen und einen Termin wählen.");
        return;
      }

      const paymentSelection = selectedPayment || "paypal";
      const paymentMethod =
        paymentSelection === "card_to_card" ? "card_to_card" : "stripe";

      try {
        const response = await fetch(
          `${API_BASE}/api/events/${selectedCard}/register/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: inputs.vorname,
              last_name: inputs.nachname,
              phone: inputs.telefon,
              email: inputs.email,
              payment_method: paymentMethod,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.detail || "Fehler bei der Registrierung.");
          return;
        }

        const data = await response.json();

        // ✅ card_to_card -> bank-transfer (بعدش دکمه اون صفحه می‌ره rules)
        if (paymentMethod === "card_to_card") {
          navigate("bank-transfer", {
            state: {
              registrationId: data.registration_id,
              eventId: selectedCard,
            },
          });
          return;
        }

        // ✅ stripe/paypal -> redirect (rules بعد از پرداخت باید با success_url برگرده به /payment-success)
        if (data.payment_url) {
          window.location.href = data.payment_url;
          return;
        }

        alert("Registrierung erfolgreich.");
        navigate("/live");
      } catch (error) {
        console.error(error);
        alert("Netzwerkfehler bei der Registrierung.");
      }
    }
  };

  return (
    <div className="min-h-screen max-w-screen back-li justify-center p-10 pb-24">
      <h1 className="text-4xl h-fit text-white py-8 font-bold text-center">
        Wähle deinen <br /> Workshop-Tag
      </h1>

      <Outlet />

      <div className="p-4 fixed bottom-0 left-0 flex justify-center w-full">
        <button
          onClick={handleNext}
          className="text-white back-bu rounded-[10px] font-semibold text-xl p-4 leading-5 h-fit w-80 mx-auto"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default MainLayout;

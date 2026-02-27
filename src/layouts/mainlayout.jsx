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
  const pathnameLower = pathname.toLowerCase();
  const inLive =
    pathnameLower === basePath || pathnameLower.startsWith(basePath + "/");
  const livePath = inLive
    ? pathnameLower.slice(basePath.length) || "/"
    : pathnameLower;

  const onRules = livePath === "/rules";
  const onConsent = livePath === "/consent";
  const onStep1 = livePath === "/" || livePath === "/step1";
  const onStep2 = livePath === "/step2";
  const onStep3 = livePath === "/step3";
  const onBankTransfer = livePath === "/bank-transfer";
  const onPaymentSuccess = livePath === "/payment-success";
  const onSuccess = livePath === "/success";

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

    if (onSuccess) {
      navigate("/Live");
      return;
    }

    // ✅ بعد از پرداخت آنلاین برگشتی (success page) -> rules
    if (onPaymentSuccess) {
      navigate("/Live/rules");
      return;
    }

    // ✅ rules -> consent (قبلاً success بود)
    if (onRules) {
      navigate("consent"); // ✅ CHANGED (was navigate("success"))
      return;
    }

    // ✅ ADDED: consent step (send to backend فقط موقع کلیک Next)
    if (onConsent) {
      const v = sessionStorage.getItem("faceVisible");
      if (v !== "1" && v !== "0") {
        alert("Bitte wählen Sie eine Option aus.");
        return;
      }
      const registrationId = sessionStorage.getItem("registrationId");
      if (!registrationId) {
        alert("Registrierungs-ID fehlt.");
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE}/api/registrations/${registrationId}/consent/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              face_visible: v === "1",
            }),
          },
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          alert(errData.detail || "Fehler beim Speichern der Zustimmung.");
          return;
        }
        navigate("success");
        return;
      } catch (e) {
        console.error(e);
        alert("Netzwerkfehler beim Speichern der Zustimmung.");
        return;
      }
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
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.detail || "Fehler bei der Registrierung.");
          return;
        }

        const data = await response.json();

        if (data.registration_id) {
          sessionStorage.setItem(
            "registrationId",
            String(data.registration_id),
          );
          sessionStorage.setItem("eventId", String(selectedCard));
        }

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
        navigate("/Live");
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

      {!onSuccess && !onBankTransfer && (
        <div className="p-4 fixed bottom-0 left-0 flex justify-center w-full">
          <button
            onClick={handleNext}
            className="text-white back-bu Button rounded-[10px] font-semibold text-xl p-4 leading-5 h-fit w-80 mx-auto"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default MainLayout;

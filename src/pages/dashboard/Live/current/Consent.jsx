import React, { useEffect, useState } from "react";
import { useBooking } from "../../../../context/BookingContext";
import "../../../../style.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://app.therealwolves.com";

function Consent() {
  const [cards, setCards] = useState([]); // فعلاً استفاده نشده، گذاشتم که چیزی نشکنه
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [faceVisible, setFaceVisible] = useState(null);

  // ✅ ADDED: هر وقت انتخاب کرد، ذخیره کن تا MainLayout
  useEffect(() => {
    if (faceVisible === null) {
      sessionStorage.removeItem("faceVisible");
      return;
    }
    sessionStorage.setItem("faceVisible", faceVisible ? "1" : "0");
  }, [faceVisible]);

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
          const isFull = event.remaining_capacity <= 0;
          const isPast = eventDate < now;

          return {
            id: event.id,
            date: eventDate.toLocaleDateString("de-DE"),
            seats: event.remaining_capacity,
            disabled: isInactive || isFull || isPast,
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
      {loading && (
        <div className="text-white text-center">Events werden geladen...</div>
      )}
      {error && !loading && (
        <div className="text-red-300 text-center">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:max-w-96 mx-auto p-2">
          {/* ---------------------- Frage (switch) ---------------------- */}
          <div className="px-6 py-5 rounded-4xl backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 gradient-border">
            <h3 className="text-white font-semibold text-xl mb-2">
              Einverständnis zur Videoaufzeichnung
            </h3>

            <p className="text-white/80 text-md leading-6 mb-4">
              Der Workshop wird zu Dokumentations und Schulungszwecken
              aufgezeichnet. Bitte geben Sie an, ob Ihr Gesicht im Video
              erkennbar sein darf oder ob es unkenntlich gemacht werden soll.
            </p>

            {/* ✅ CHANGED: switch -> radio */}
            <div className="grid gap-3">
              <label className="z-50 flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                <div className="grid gap-1">
                  <span className="text-white font-semibold text-md">
                    ✅ Einverstanden
                  </span>
                  <span className="text-white/60 text-sm">
                    Ich stimme zu, dass mein Gesicht im Video sichtbar ist.
                  </span>
                </div>
                <input
                  id="accept"
                  type="radio"
                  name="videoConsent"
                  className="radio-input hidden"
                  checked={faceVisible === true}
                  onChange={() => setFaceVisible(true)}
                />
                <label htmlFor="accept" className="radio">
                  <span className="circle"></span>
                </label>
              </label>

              <label className="z-50 flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                
                <div className="grid gap-1">
                  <span className="text-white font-semibold text-md">
                    🔒 Nicht einverstanden
                  </span>
                  <span className="text-white/60 text-sm">
                    Mein Gesicht soll im Video unkenntlich gemacht werden.
                  </span>
                </div>
                <input
                  id="refuse"
                  type="radio"
                  name="videoConsent"
                  className="radio-input hidden"
                  checked={faceVisible === false}
                  onChange={() => setFaceVisible(false)}
                />
                <label htmlFor="refuse" className="radio">
                  <span className="circle"></span>
                </label>
              </label>

              {faceVisible === null && ( // ✅ ADDED
                <div className="text-amber-200/90 text-sm">
                  Bitte wählen Sie eine Option aus, um fortzufahren.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Consent;

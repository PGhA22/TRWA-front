import React, { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import "../style.css";

const API_BASE = import.meta.env.VITE_API_BASE || "https://app.therealwolves.com";

function Rules() {
  const { selectedCard, setSelectedCard } = useBooking(); // فعلاً استفاده نشده، گذاشتم که چیزی نشکنه
  const [cards, setCards] = useState([]); // فعلاً استفاده نشده، گذاشتم که چیزی نشکنه
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // true  => Gesicht sichtbar (Einverständnis)
  // false => Gesicht unkenntlich (verpixelt/blurred)
  const [faceVisible, setFaceVisible] = useState(true);

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
      {loading && <div className="text-white text-center">Events werden geladen...</div>}
      {error && !loading && <div className="text-red-300 text-center">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-6 md:max-w-96 mx-auto p-2">
          {/* ---------------------- Regeln (no switch) ---------------------- */}
          <div className="px-6 py-5 rounded-4xl backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 gradient-border">
            <h3 className="text-white font-semibold text-lg mb-3">Workshop-Regeln</h3>

            <div className="grid gap-3 text-white/85 text-sm leading-6">
              <p>
                <span className="mr-2">✅</span>
                <span className="font-semibold text-white">Materialien:</span> Während des Workshops sind nur Stift und Papier erlaubt.
              </p>
              <p>
                <span className="mr-2">🚫📱</span>
                Mobiltelefone, Tablets, Laptops oder andere elektronische Geräte dürfen während der Sessions nicht benutzt werden –
                außer wenn dies ausdrücklich von den Organisatoren erlaubt wird.
              </p>
            </div>
          </div>

          {/* ---------------------- Frage (switch) ---------------------- */}
          <div className="px-6 py-5 rounded-4xl backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 gradient-border">
            <h3 className="text-white font-semibold text-lg mb-2">Einverständnis zur Aufnahme</h3>

            <p className="text-white/80 text-sm leading-6 mb-4">
              Der Workshop wird aufgezeichnet. Möchten Sie zustimmen, dass Ihr Gesicht im Video erkennbar ist,
              oder soll Ihr Gesicht unkenntlich gemacht werden (verpixelt/blurred)?
            </p>

            <div className="flex items-center justify-between gap-4">
              {/* text */}
              <div className="grid gap-1">
                <span className="text-white font-semibold text-sm">
                  {faceVisible ? "✅ Einverstanden – Gesicht erkennbar" : "🙅 Nicht einverstanden – Gesicht unkenntlich"}
                </span>
                <span className="text-white/60 text-xs">
                  {faceVisible
                    ? "Ihr Gesicht darf im Video sichtbar sein."
                    : "Ihr Gesicht wird im Video verpixelt (blurred)."}
                </span>
              </div>

              {/* SWITCH (works reliably) */}
              <label className="relative inline-flex items-center z-9999 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={faceVisible}
                  onChange={(e) => setFaceVisible(e.target.checked)}
                />

                {/* track */}
                <span
                  className="
                    relative w-14 h-8 rounded-full
                    bg-white/10 border border-white/20
                    transition
                    peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/30
                    peer-checked:bg-[#4592D5] peer-checked:border-[#4592D5]
                  "
                >
                  {/* thumb */}
                  <span
                    className="
                      absolute top-1 left-1 h-6 w-6 rounded-full bg-white
                      transition-transform duration-300
                      transform
                      peer-checked:translate-x-6
                    "
                  />
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Rules;

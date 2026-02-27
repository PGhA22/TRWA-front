import React, { useEffect, useState } from "react";
import { useBooking } from "../../../../context/BookingContext";
import "../../../../style.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://app.therealwolves.com";

function Rules() {
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
      {loading && (
        <div className="text-white text-center">Events werden geladen...</div>
      )}
      {error && !loading && (
        <div className="text-red-300 text-center">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:max-w-96 mx-auto p-2">
          {/* ---------------------- Regeln (no switch) ---------------------- */}
          <div className="px-6 py-5 rounded-4xl backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 gradient-border">
            <h3 className="text-white font-semibold text-xl mb-3">
              Workshopregeln
            </h3>

            <div className="grid gap-3 text-white/85 text-md leading-6">
              <p>
                <span className="mr-2">✅</span>
                <span className="font-semibold text-white">Pünktlichkeit</span>
                <br />
                Bitte erscheinen Sie 15 Minuten vor Beginn des Workshops.
              </p>
              <p>
                <span className="mr-2">✅</span>
                <span className="font-semibold text-white">Materialien</span>
                <br />
                Während des Workshops sind ausschließlich Stift und Papier
                erlaubt.
              </p>
              <p>
                <span className="mr-2">🚫</span>
                <span className="font-semibold text-white">
                  Elektronische Geräte
                </span>
                <br />Mobiltelefone, Tablets, Laptops oder andere elektronische Geräte dürfen während der Sessions nicht verwendet werden, es sei denn, dies wurde ausdrücklich von den Organisatoren genehmigt.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Rules;

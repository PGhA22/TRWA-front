import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://app.therealwolves.com";

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (e) {
      // fallback ساده
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="ml-2 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15"
      title={label}
    >
      {copied ? "✓" : "⧉"}
    </button>
  );
}

function BankTransfer() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const registrationId = state.registrationId;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!registrationId) {
      alert("Registrierungs-ID fehlt.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/registrations/${registrationId}/confirm-bank-transfer/`,
        { method: "POST" },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.detail || "Fehler beim Bestätigen.");
        return;
      }

      alert("✅ Bestätigt! Deine Registrierung ist abgeschlossen.");
      navigate("/Live/rules", {
        state: { registrationId, eventId: state.eventId },
      });
    } catch (e) {
      console.error(e);
      alert("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  };

  const NAME = "Pouria Amir Hajlou";
  const IBAN = "DE61 5002 4024 4197 6981 41";
  const BIC = "DEFFDEFFXXX";

  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold text-center">
        Banküberweisung / Karte-zu-Karte
      </h2>

      <div className="w-full bg-black/40 rounded-3xl p-5 border border-white/20">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white/60">Kontoinhaber</p>
            <p className="text-lg font-semibold">{NAME}</p>
          </div>
          <CopyButton text={NAME} label="Name kopieren" />
        </div>

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-white/60">IBAN</p>
            <p className="text-base font-mono break-all">{IBAN}</p>
          </div>
          <CopyButton text={IBAN.replace(/\s+/g, "")} label="IBAN kopieren" />
        </div>

        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white/60">BIC</p>
            <p className="text-base font-mono">{BIC}</p>
          </div>
          <CopyButton text={BIC} label="BIC kopieren" />
        </div>

        {registrationId && (
          <div className="mt-2 text-xs text-white/50 flex items-center justify-between">
            <span>Verwendungszweck: {registrationId}</span>
            <CopyButton text={String(registrationId)} label="ID kopieren" />
          </div>
        )}
      </div>

      <p className="text-sm text-center text-white/70">
        Bitte überweise den Betrag mit den oben stehenden Daten. Nachdem du die
        Überweisung ausgeführt hast, klicke auf{" "}
        <span className="font-semibold">Bestätigen</span>, um die Buchung
        abzuschließen.
      </p>

      <button
        onClick={handleConfirm}
        disabled={loading}
        className={`mt-2 px-6 py-3 rounded-2xl back-bu text-white font-semibold text-lg ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Bitte warten..." : "Bestätigen"}
      </button>
    </div>
  );
}

export default BankTransfer;

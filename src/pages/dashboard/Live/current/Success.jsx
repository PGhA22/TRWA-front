import React from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  return (
    <>
      <div className=" flex flex-col items-center justify-center text-white p-8 text-center">
        <div className="px-6 py-5 rounded-4xl backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 gradient-border flex flex-col gap-6 w-100/100 sm:w-70/100 md:w-60/100 lg:w-50/100 xl:w-40/100 max-w-lg">
          <h3 className="text-white font-semibold text-lg">
            Vielen Dank für Ihre Anmeldung
          </h3>
          <p>Ihre Anmeldung zum Workshop war erfolgreich.</p>
          <p>
            Wir haben Ihre Informationen erhalten und melden uns in Kürze mit
            weiteren Details bei Ihnen.
          </p>
          <p> Bei Fragen können Sie uns jederzeit kontaktieren. </p>
          <p>Wir freuen uns auf Ihre Teilnahme.</p>
        </div>
        <button
          className="mt-5 px-6 py-3 rounded-2xl back-bu font-semibold"
          onClick={() => navigate("/")}
        >
          Zur Startseite
        </button>
      </div>
    </>
  );
}

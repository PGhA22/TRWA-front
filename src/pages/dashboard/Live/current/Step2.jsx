import React from "react";
import { useBooking } from "../../../../context/BookingContext";
import "../../../../style.css";

function Step2() {
  const { inputs, setInputs } = useBooking();
  const [selected, setSelected] = React.useState(null);

  const fields = [
    { id: 1, name: "vorname", label: "Vorname", placeholder: "Vorname eingeben" },
    { id: 2, name: "nachname", label: "Nachname", placeholder: "Nachname eingeben" },
    { id: 3, name: "telefon", label: "Telefonnummer", placeholder: "Telefonnummer eingeben" },
    { id: 4, name: "email", label: "E-Mail", placeholder: "E-Mail eingeben" },
  ];

  return (
    <div className="flex flex-wrap md:max-w-96 mx-auto gap-9 justify-center p-2">
      {fields.map((field) => {
        const value = inputs[field.name] ?? "";
        const hasValue = value.trim() !== "";
        const isSelected = selected === field.id;
        const isActive = isSelected || hasValue;

        return (
          <div key={field.id} className="w-full">
            <label className="block text-white mb-2 px-2 text-xl font-semibold">{field.label}</label>

            <div
              onClick={() => setSelected(field.id)}
              className={`
                w-full h-14 cursor-text rounded-4xl
                  backdrop-blur-sm bg-radial from-60% from-transparent to-black/10
                ${isActive ? "in-gradient-border-ch" : "in-gradient-border"}
              `}
            >
              <input
                className="w-full h-14 rounded-4xl absolute z-50 border-0 outline-0 ring-0 placeholder:text-white/60 placeholder:font-semibold text-base text-white px-6 focus:placeholder:opacity-0 bg-transparent"
                type="text"
                placeholder={field.placeholder}
                value={value}
                onFocus={() => setSelected(field.id)}
                onChange={(e) => {
                  let val = e.target.value;

                  // ---------------------------
                  // Validation for German Phone
                  // ---------------------------
                  if (field.name === "telefon") {
                    // Only digits
                    val = val.replace(/[^0-9]/g, "");

                    // Max 14 digits (German mobile numbers)
                    if (val.length > 14) return;
                  }

                  setInputs({
                    ...inputs,
                    [field.name]: val,
                  });
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Step2;

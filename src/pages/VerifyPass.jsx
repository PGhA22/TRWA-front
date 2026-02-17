import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { http } from "../server/http";
import "../style.css";
import Button from "../components/ui/Button";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;
  const contactType = location.state?.contactType || "device";

  // useEffect(() => {
  //   document.title = "validieren"; TODO-title
  // }, []);

  // errors
  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  function showError(msg) {
    setError(msg);
    setErrorOpen(true);

    clearTimeout(showError._t);
    showError._t = setTimeout(() => {
      closeError();
    }, 20000);
  }
  function closeError() {
    setErrorOpen(false);

    setTimeout(() => {
      setError("");
    }, 300);
  }

  // boxs
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const code = useMemo(() => digits.join(""), [digits]);

  function focusIndex(i) {
    const el = inputsRef.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  }
  function setDigitAt(i, val) {
    setDigits((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  }
  function handleChange(i, e) {
    const raw = e.target.value;
    const onlyNums = raw.replace(/\D/g, "");

    // اگر کاربر چند رقم زد (یا موبایل auto-fill کرد)
    if (onlyNums.length > 1) {
      const arr = onlyNums.slice(0, 6).split("");
      setDigits((prev) => {
        const next = [...prev];
        for (let k = 0; k < 6; k++) next[k] = arr[k] ?? "";
        return next;
      });
      const nextFocus = Math.min(onlyNums.length, 6) - 1;
      focusIndex(nextFocus >= 0 ? nextFocus : 0);
      return;
    }

    const val = onlyNums.slice(0, 1);
    setDigitAt(i, val);

    if (val && i < 5) focusIndex(i + 1);
  }
  function handleKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (digits[i]) {
        setDigitAt(i, "");
      } else if (i > 0) {
        focusIndex(i - 1);
        setDigitAt(i - 1, "");
      }
      e.preventDefault();
    }

    if (e.key === "ArrowLeft" && i > 0) {
      focusIndex(i - 1);
      e.preventDefault();
    }

    if (e.key === "ArrowRight" && i < 5) {
      focusIndex(i + 1);
      e.preventDefault();
    }
  }
  function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!text) return;

    const arr = text.split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < 6; i++) next[i] = arr[i] ?? "";
      return next;
    });

    focusIndex(Math.min(text.length, 6) - 1);
  }
  async function checkInput() {
    if (loading) return;
    setLoading(true);
    if (code.length !== 6) {
      showError("Bitte geben Sie den 6-stelligen Code ein");
      setLoading(false);
      return;
    }

    if (!identifier) {
      showError("Informationen fehlen. Bitte registrieren Sie sich erneut");
      setTimeout(() => {
        navigate("/SignUp");
      }, 3000);
      setLoading(false);
      return;
    }

    try {
      // TODO-url-Verify
      const respon = await http.post("/api/accounts/2fa/toggle", {
        identifier,
        code,
      });

      navigate("/Dashboard");
    } catch (error) {
      console.log(error);

      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 400 || status === 401) {
        showError(data?.detail || "Ungültiger Code");
      } else {
        showError("Netzwerkfehler. Bitte versuchen Sie es erneut");
      }
    } finally {
      setLoading(false);
    }
  }

  async function resendFunc() {
    if (loading) return;

    if (!identifier) {
      showError("Informationen fehlen. Bitte registrieren Sie sich erneut");
      setTimeout(() => {
        navigate("/SignUp");
      }, 3000);
      return;
    }

    try {
      setLoading(true);

      // TODO-url-Verify2
      await http.post("/api/accounts/2fa/toggle/", { identifier });

      showError("Code wurde erneut gesendet.");
    } catch (error) {
      console.log(error);

      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 400 || status === 401) {
        showError(data?.detail || "Erneutes Senden fehlgeschlagen.");
      } else {
        showError("Netzwerkfehler. Bitte versuchen Sie es erneut");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-base h-screen flex flex-col items-center justify-center gap-4 2xl:gap-8 text-white font-semibold text-center">
        <h3 className="text-[47px] font-extrabold w-10/12">
          2FA-Code eingeben
        </h3>
        <p className="text-2xl w-11/12">
          Bitte geben Sie den 6-stelligen Code ein, der an Ihre {contactType}{" "}
          gesendet wurde
        </p>

        <div
          className="w-10/12 max-w-md gap-3 flex flex-row justify-center"
          onPaste={handlePaste}
        >
          {digits.map((d, i) => (
            <div
              key={i}
              className="in-glass-border-ch glass-border-ch in-gradient-border gradient-border w-14.5 rounded-3xl my-1.5"
            >
              <input
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="-"
                value={d}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="border-none glass-input w-full text-center px-3 py-3 2xl:py-3.5 rounded-4xl outline-none text-white backdrop-blur-sm bg-radial from-60% from-transparent to-black/10"
                maxLength={1}
              />
            </div>
          ))}
        </div>

        <div
          className={`fixed flex top-5 right-1/12 max-sm:right-auto max-sm:left-auto pb-3 px-3 font-light text-white max-w-10/12 bg-gray-700/30 border border-white rounded-lg select-none 
            transition-all duration-300 ease-in 
            ${
              errorOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3 pointer-events-none"
            }`}
        >
          <p className="h-min rounded-lg px-1 flex pt-3">{error}</p>
          <button
            type="button"
            onClick={closeError}
            className="ml-8 cursor-pointer select-none text-xs"
          >
            ✕
          </button>
        </div>

        <div className="w-10/12">
          <Button
            type="submit"
            onClick={checkInput}
            loading={loading}
            className="text-lg"
          >
            {loading ? "Bestätigen..." : "Bestätigen"}
          </Button>
        </div>
        <span className="mt-3">
          Code nicht erhalten?{" "}
          <button
            type="button"
            onClick={resendFunc}
            className="text-blue-200 cursor-pointer"
          >
            Erneut senden
          </button>
        </span>
      </div>
    </>
  );
}

export default Verify;

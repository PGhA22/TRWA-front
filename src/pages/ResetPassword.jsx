import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../server/http";
import "../style.css";
import FormInput from "../components/ui/FormInput";
import Button from "../components/ui/Button";

function ResetPass() {
  const navigate = useNavigate();
  //   useEffect(() => {
  //     document.title = "Passwort zurücksetzen";
  //   }, []);

  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  // errors
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

  async function checkInput() {
    if (loading) return;
    setLoading(true);

    const userContact = contact.trim();

    let userData = {
      email: null,
      phoneNumber: null,
    };

    // email-phone_checker
    if (userContact === "") {
      document.querySelector("#errorContact").classList.remove("hidden");
      document.querySelector("#svgContact").classList.add("fill-red-500");
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorContact").classList.add("hidden");
      document.querySelector("#svgContact").classList.remove("fill-red-500");
    }
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^[0-9]{7,15}$/;
    let contactType = "'Kontaktmethode'";
    if (emailPattern.test(contact)) {
      contactType = "E-mail";
    } else if (phonePattern.test(contact)) {
      contactType = "Telefonnummer";
    } else {
      document.querySelector("#errorContact").classList.remove("hidden");
      document.querySelector("#svgContact").classList.add("fill-red-500");
      setLoading(false);
      return;
    }
    try {
      // TODO-Server-url-ResetPass
      const respon = await await http.post("/users/users", userData);
      showError(
        `Link zum Zurücksetzen wurde an Ihre(n) ${contactType.toLowerCase()} gesendet`,
      );

      setTimeout(() => {
        navigate("/SignIn");
      }, 3500);
      setLoading(false);
    } catch (error) {
      const status = error?.respons?.status;
      const errorData = error?.respons?.data;
      console.log(status);
      console.log(errorData);

      // TODO-Server-repon
      if (status === 404 || errorData?.error === "user-not-found") {
        showError("E-Mail-Adresse oder Telefonnummer ist falsch");
      } else {
        showError("Bitte versuchen Sie es erneut");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="text-base h-screen flex flex-col items-center justify-center gap-4
      2xl:gap-8 text-white font-semibold text-center">
        <h3 className="text-[47px] font-extrabold w-10/12">
          Passwort vergessen?
        </h3>
        <p className="text-2xl w-11/12 -mt-5">
          Wir senden Ihnen einen Link, um Ihr Passwort zurückzusetzen.{" "}
        </p>
        <FormInput
          parentClassName="w-10/12 max-w-md"
          wrapperClassName="w-10/12 max-w-md my-1.5"
          inputProps={{
            id: "identifier",
            type: "text",
            placeholder: "E-Mail oder Telefonnummer",
            onChange: (e) => setContact(e.target.value),
          }}
          inputClassName="pl-8"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              id="svgContact"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4.5 z-10 absolute mx-2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
              />
            </svg>
          }
          errorId="errorContact"
          errorText="Ungültige E-Mail oder Mobilnummer"
        />

        <div className="w-10/12">
          <Button
            type="submit"
            onClick={checkInput}
            loading={loading}
            className="text-lg"
          >
            {loading ? "Wird zurückgesetzt..." : "Passwort zurücksetzen"}
          </Button>
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
        <span className="mt-3">
          Erinnern Sie sich an Ihr Passwort?{" "}
          <Link to="/SignIn" className="text-blue-200">
            Zur Anmeldeseite
          </Link>
        </span>
      </div>
    </>
  );
}

export default ResetPass;

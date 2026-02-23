import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../server/http";
import "../style.css";
import FormInput from "../components/ui/FormInput";
import Button from "../components/ui/Button";

function Signin() {
  // TODO_FIX_pageTitle
  // useEffect(() => {
  //   document.title = "Anmeldung";
  // }, []);
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  // const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const userPassword = password.trim();

    let userData = {
      identifier: userContact,
      password: userPassword,
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
    if (!emailPattern.test(userContact) && !phonePattern.test(userContact)) {
      document.querySelector("#errorContact").classList.remove("hidden");
      document.querySelector("#svgContact").classList.add("fill-red-500");
      setLoading(false);
      return;
    }
    // passCheck
    if (userPassword == "") {
      document.querySelector("#errorPass").classList.remove("hidden");
      document.querySelector("#svgPass").classList.add("fill-red-500");
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorPass").classList.add("hidden");
      document.querySelector("#svgPass").classList.remove("fill-red-500");
    }
    try {
      const respon = await http.post("/api/accounts/login/", userData);

      navigate("/Dashboard");
    } catch (error) {
      const status = error?.response?.status;
      const errorData = error?.response?.data?.error;
      console.log(status);
      console.log(errorData);

      if (errorData) {
        showError(errorData);
      } else {
        showError("Bitte versuchen Sie es erneut");
      }
    } finally {
      setLoading(false);
    }
    return;
  }

  return (
    <>
      <div className="text-base h-screen flex flex-col items-center justify-center gap-4 2xl:gap-8 text-white font-semibold text-center">
        <h3 className="text-[47px] font-extrabold w-10/12">
          Willkommen zurück!
        </h3>
        <p className="text-2xl w-11/12 -mt-5">
          Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um auf das
          Admin-Panel zuzugreifen.
        </p>
        <FormInput
          parentClassName="w-10/12 max-w-md"
          wrapperClassName="w-10/12 max-w-md my-1.5"
          inputProps={{
            id: "identifier",
            type: "text",
            placeholder: "E-Mail-Adresse oder Mobilnummer",
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
        <FormInput
          parentClassName="w-10/12 max-w-md"
          wrapperClassName="w-10/12 max-w-md my-1.5"
          inputProps={{
            type: "password",
            placeholder: "Passwort",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          }}
          inputClassName="pl-8"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              id="svgPass"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 z-10 absolute mx-2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
          }
          errorId="errorPass"
          errorText="Passwort ist erforderlich"
        />

        <div className="w-10/12">
          <Button
            type="submit"
            onClick={checkInput}
            loading={loading}
            className="text-lg"
          >
            {loading ? "Anmelden..." : "Anmelden"}
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
          {/* TODO-transision */}
          <div className="h-0.5 w-11/12 bottom-0 absolute bg-blue-50 transition-all w"></div>
        </div>
        <span className="mt-1">
          Noch kein Konto?{" "}
          <Link to="/SignUp" className="text-blue-200">
            Hier registrieren
          </Link>
        </span>
        <div className="w-full flex items-center mt-4">
          <hr className="w-1/5 grow mt-1" />
          <span className="mx-3">oder weiter mit</span>
          <hr className="w-1/5 grow mt-1" />
        </div>
        <div className="flex gap-2.5">
          <button className="bg-[#00008088] py-1 px-2 rounded-lg cursor-pointer">
            Google
          </button>
        </div>
      </div>
    </>
  );
}

export default Signin;

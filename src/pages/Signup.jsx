import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../server/http";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import PhoneInput from "react-phone-input-2";
import "swiper/css";
import "swiper/css/pagination";
import "react-phone-input-2/lib/style.css";
import "../style.css";
import Checkbox from "../components/ui/CheckBox";
import FormInput from "../components/ui/FormInput";
import SignIn_withGoogle from "../components/ui/SignIn_withGoogle";

function Signup() {
  const navigate = useNavigate();
  // TODO_FIX_pageTitle
  // useEffect(() => {
  //   document.title = "Registrierung";
  // }, []);

  const [gName, setGName] = useState("");
  const [fName, setFName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // swiper
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // auto-focus
  const firstRef = useRef(null);
  const lastRef = useRef(null);
  const birthRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmRef = useRef(null);

  const lockRef = useRef(false);
  const lock = () => {
    lockRef.current = true;
    setTimeout(() => (lockRef.current = false), 350);
  };

  const focusByIndex = (swiper) => {
    const i = swiper?.activeIndex ?? swiperRef.current?.activeIndex ?? 0;

    if (i === 0) firstRef.current?.focus();
    if (i === 1) birthRef.current?.focus();
    if (i === 2) phoneRef.current?.focus();
    if (i === 3) passRef.current?.focus();
  };

  const go = (index) => {
    if (lockRef.current) return;
    lock();
    swiperRef.current?.slideTo(index);
  };

  const onEnter = (next) => (e) => {
    if (e.key !== "Enter") return;
    if (e.repeat) return;
    e.preventDefault();
    e.stopPropagation();
    if (lockRef.current) return;
    next?.();
  };

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

  function formatBirthInput(v) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);

    let out = dd;
    if (mm) out += "." + mm;
    if (yyyy) out += "." + yyyy;
    return out;
  }

  function parseGermanDate(str) {
    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(str);
    if (!m) return null;

    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);

    // if (yyyy < 1900 || yyyy > new Date().getFullYear()) return null;
    if (mm < 1 || mm > 12) return null;

    const d = new Date(yyyy, mm - 1, dd);
    if (
      d.getFullYear() !== yyyy ||
      d.getMonth() !== mm - 1 ||
      d.getDate() !== dd
    )
      return null;

    return d;
  }

  function germanToISO(str) {
    const dob = parseGermanDate(str);
    if (!dob) return null;

    const yyyy = dob.getFullYear();
    const mm = String(dob.getMonth() + 1).padStart(2, "0");
    const dd = String(dob.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  const validateStep = (step) => {
    const userGName = gName.trim();
    const userFName = fName.trim();
    const userPhone = phone.trim();
    const userEmail = email.trim();
    const userPassword = password.trim();

    // step 0: name
    if (step === 0) {
      if (userGName === "" || userFName === "") {
        document.querySelector("#errorUser")?.classList.remove("hidden");
        document.querySelector("#svgUser")?.classList.add("fill-red-500");
        requestAnimationFrame(() =>
          userGName === ""
            ? firstRef.current?.focus()
            : lastRef.current?.focus(),
        );
        return false;
      }
      document.querySelector("#errorUser")?.classList.add("hidden");
      document.querySelector("#svgUser")?.classList.remove("fill-red-500");
      return true;
    }

    // step 1: birth
    if (step === 1) {
      const dob = parseGermanDate(birthDate);
      if (!dob) {
        document.querySelector("#errorBirth")?.classList.remove("hidden");
        document.querySelector("#svgBirth")?.classList.add("fill-red-500");
        requestAnimationFrame(() => birthRef.current?.focus());
        return false;
      }

      const today = new Date();
      const t = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const d = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      if (d > t) {
        showError("Geburtsdatum darf nicht in der Zukunft liegen.");
        document.querySelector("#errorBirth")?.classList.remove("hidden");
        document.querySelector("#svgBirth")?.classList.add("fill-red-500");
        requestAnimationFrame(() => birthRef.current?.focus());
        return false;
      }

      document.querySelector("#errorBirth")?.classList.add("hidden");
      document.querySelector("#svgBirth")?.classList.remove("fill-red-500");
      return true;
    }

    // step 2: phone + email
    if (step === 2) {
      let ok = true;

      // phone
      const phonePattern = /^[0-9]{7,15}$/;
      if (userPhone === "" || !phonePattern.test(userPhone)) {
        document.querySelector("#errorPhone")?.classList.remove("hidden");
        document.querySelector("#svgPhone")?.classList.add("fill-red-500");
        requestAnimationFrame(() => phoneRef.current?.focus());
        ok = false;
      } else {
        document.querySelector("#errorPhone")?.classList.add("hidden");
        document.querySelector("#svgPhone")?.classList.remove("fill-red-500");
      }

      // email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (userEmail === "" || !emailPattern.test(userEmail)) {
        document.querySelector("#errorEmail")?.classList.remove("hidden");
        document.querySelector("#svgEmail")?.classList.add("fill-red-500");
        if (ok) requestAnimationFrame(() => emailRef.current?.focus());
        ok = false;
      } else {
        document.querySelector("#errorEmail")?.classList.add("hidden");
        document.querySelector("#svgEmail")?.classList.remove("fill-red-500");
      }

      return ok;
    }

    // step 3: password + confirm
    if (step === 3) {
      if (userPassword === "") {
        document.querySelector("#errorPass")?.classList.remove("hidden");
        document.querySelector("#svgPass")?.classList.add("fill-red-500");
        requestAnimationFrame(() => passRef.current?.focus());
        return false;
      } else {
        document.querySelector("#errorPass")?.classList.add("hidden");
        document.querySelector("#svgPass")?.classList.remove("fill-red-500");
      }

      if (password !== confirm) {
        document.querySelector("#errorConfimPass")?.classList.remove("hidden");
        document.querySelector("#svgConfimPass")?.classList.add("fill-red-500");
        requestAnimationFrame(() => confirmRef.current?.focus());
        return false;
      } else {
        document.querySelector("#errorConfimPass")?.classList.add("hidden");
        document
          .querySelector("#svgConfimPass")
          ?.classList.remove("fill-red-500");
      }

      return true;
    }

    return true;
  };

  const nextStep = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const step = swiper.activeIndex;
    if (!validateStep(step)) return;

    if (swiper.isEnd) checkInput();
    else swiper.slideNext();
  };

  async function checkInput() {
    if (loading) return;
    setLoading(true);

    const userGName = gName.trim();
    const userFName = fName.trim();
    const userPhone = phone.trim();
    const userEmail = email.trim();

    const userPassword = password.trim();

    let userData = {
      first_name: userGName,
      last_name: userFName,
      email: userEmail,
      phone_number: userPhone,
      date_of_birth: germanToISO(birthDate),
      password: userPassword,
      require_otp: twoFactor,
    };

    // userChecker
    if (userGName === "" || userFName === "") {
      document.querySelector("#errorUser").classList.remove("hidden");
      document.querySelector("#svgUser").classList.add("fill-red-500");
      swiperRef.current?.slideTo(0);
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorUser").classList.add("hidden");
      document.querySelector("#svgUser").classList.remove("fill-red-500");
    }

    // BirthChecher
    const dob = parseGermanDate(birthDate);
    if (!dob) {
      document.querySelector("#errorBirth").classList.remove("hidden");
      document.querySelector("#svgBirth").classList.add("fill-red-500");
      swiperRef.current?.slideTo(1);
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorBirth").classList.add("hidden");
      document.querySelector("#svgBirth").classList.remove("fill-red-500");

      // fea
      const today = new Date();
      const t = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const d = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());

      if (d > t) {
        showError("Geburtsdatum darf nicht in der Zukunft liegen.");
        document.querySelector("#errorBirth").classList.remove("hidden");
        document.querySelector("#svgBirth").classList.add("fill-red-500");
        swiperRef.current?.slideTo(1);
        setLoading(false);
        return;
      }
    }

    // phone_checker
    if (userPhone === "") {
      document.querySelector("#errorPhone").classList.remove("hidden");
      document.querySelector("#svgPhone").classList.add("fill-red-500");
      swiperRef.current?.slideTo(2);
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorPhone").classList.add("hidden");
      document.querySelector("#svgPhone").classList.remove("fill-red-500");
    }
    let phonePattern = /^[0-9]{7,15}$/;
    if (phonePattern.test(phone)) {
      userData.phone_number = userPhone;
    } else {
      document.querySelector("#errorPhone").classList.remove("hidden");
      document.querySelector("#svgPhone").classList.add("fill-red-500");
      setLoading(false);
      return;
    }
    // email-checker
    if (userEmail === "") {
      document.querySelector("#errorEmail").classList.remove("hidden");
      document.querySelector("#svgEmail").classList.add("fill-red-500");
      swiperRef.current?.slideTo(2);
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorEmail").classList.add("hidden");
      document.querySelector("#svgEmail").classList.remove("fill-red-500");
    }
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
      userData.email = userEmail;
    } else {
      document.querySelector("#errorEmail").classList.remove("hidden");
      document.querySelector("#svgEmail").classList.add("fill-red-500");
      swiperRef.current?.slideTo(2);
      setLoading(false);
      return;
    }

    // passCheck
    if (userPassword === "") {
      document.querySelector("#errorPass").classList.remove("hidden");
      document.querySelector("#svgPass").classList.add("fill-red-500");
      swiperRef.current?.slideTo(3);
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorPass").classList.add("hidden");
      document.querySelector("#svgPass").classList.remove("fill-red-500");
    }
    // confirmChecker
    if (password !== confirm) {
      document.querySelector("#errorConfimPass").classList.remove("hidden");
      document.querySelector("#svgConfimPass").classList.add("fill-red-500");
      swiperRef.current?.slideTo(3);
      setLoading(false);
      return;
    } else {
      document.querySelector("#errorConfimPass").classList.add("hidden");
      document.querySelector("#svgConfimPass").classList.remove("fill-red-500");
    }
    // server
    try {
      const respon = await http.post("/api/accounts/register/", userData);
      console.log(respon);

      const otpId = respon?.data?.otp_id;

      // if (!otpId) {
      //   showError("Registrierung fehlgeschlagen. Bitte erneut versuchen.");
      //   setLoading(false);
      //   return;
      // }

      // navigate("/Verify", {
      //   state: {
      //     mode: "email_verify",
      //     otp_id: otpId,
      //     email: userEmail,
      //     phone: userPhone,
      //     contactType: "E-Mail-Adresse",
      //     twoFactor: twoFactor,
      //   },
      // });
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      const errorData = error?.response?.data;
      console.log("status", status);
      console.log("errorData", errorData);
      console.log(error?.response);

      if (errorData) {
        if (typeof errorData === "object") {
          const message = Object.values(errorData).flat().join(" ");
          showError(message);
        } else {
          showError(String(errorData));
        }
      } else {
        showError("Bitte versuchen Sie es erneut");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="my-20 text-base flex flex-col items-center justify-center gap-4 2xl:gap-8 text-white font-semibold text-center overflow-hidden">
        <h3 className="text-[47px] font-extrabold w-10/12">
          Erstellen Sie Ihr Konto
        </h3>
        <p className="text-2xl w-11/12 -mt-5">
          Geben Sie Ihre Daten ein, um ein neues Konto zu erstellen.
        </p>

        <Swiper
          direction="vertical"
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="h-full"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            requestAnimationFrame(() => firstRef.current?.focus());
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChangeTransitionEnd={(swiper) => {
            focusByIndex(swiper);
          }}
        >
          <SwiperSlide
            data-step="name"
            className="h-full flex! items-center justify-center"
          >
            <div className="flex flex-row gap-2 w-10/12 max-w-md relative">
              <div className="in-glass-border-ch glass-border-ch in-gradient-border gradient-border w-1/2 rounded-4xl my-1.5 flex-1 min-w-0 relative">
                <input
                  ref={firstRef}
                  type="text"
                  placeholder="Vorname"
                  onChange={(e) => setGName(e.target.value)}
                  onKeyDown={onEnter(() => lastRef.current?.focus())}
                  className="js-slide-input border-none glass-input w-full pl-10 pr-3 py-3 2xl:py-3.5 rounded-4xl outline-none text-white backdrop-blur-sm bg-radial from-60% from-transparent to-black/10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  id="svgUser"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4.5 z-10 absolute mx-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div className="in-glass-border-ch glass-border-ch in-gradient-border gradient-border w-1/2 rounded-4xl my-1.5 flex-1 min-w-0">
                <input
                  ref={lastRef}
                  type="text"
                  placeholder="Nachname"
                  onChange={(e) => setFName(e.target.value)}
                  onKeyDown={onEnter(nextStep)}
                  className="js-slide-input border-none glass-input w-full pl-5 pr-3 py-3 2xl:py-3.5 rounded-4xl outline-none text-white backdrop-blur-sm bg-radial from-60% from-transparent to-black/10"
                />
              </div>
              <span
                id="errorUser"
                className="hidden m-0 text-[#ff0000] -bottom-4 mt-px left-5 absolute font-extralight"
              >
                Vollständigen Namen eingeben
              </span>
            </div>
          </SwiperSlide>
          <SwiperSlide
            data-step="birth"
            className="h-full flex! items-center justify-center "
          >
            <FormInput
              ref={birthRef}
              parentClassName="w-10/12 max-w-md"
              wrapperClassName="w-10/12 max-w-md my-1.5"
              inputProps={{
                type: "text",
                inputMode: "numeric",
                placeholder: "TT.MM.JJJJ",
                value: birthDate,
                onChange: (e) => setBirthDate(formatBirthInput(e.target.value)),
                onKeyDown: onEnter(nextStep),
              }}
              inputClassName="js-slide-input pl-10"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  id="svgBirth"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 z-10 absolute mx-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
              }
              errorId="errorBirth"
              errorText="Ungültiges Datum. Format: TT.MM.JJJJ"
              errorClassName=""
            />
          </SwiperSlide>
          <SwiperSlide
            data-step="contact"
            className="h-full flex! flex-col items-center justify-center gap-3"
          >
            <div className="w-10/12 max-w-md my-1.5 relative">
              <div className="in-glass-border-ch glass-border-ch in-gradient-border gradient-border rounded-4xl relative">
                <PhoneInput
                  country={"de"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  enableSearch={true}
                  autoFormat={true}
                  searchPlaceholder="Search country"
                  disableSearchIcon={true}
                  inputProps={{
                    name: "phone",
                    required: true,
                    ref: phoneRef,
                    placeholder: "Mobilnummer",
                    onKeyDown: onEnter(() => emailRef.current?.focus()),
                  }}
                  containerClass="w-full js-slide-input w-full rounded-4xl glass-input text-white outline-none"
                  inputClass="!w-full !pl-15 !rounded-4xl !glass-input !text-white"
                  buttonClass="!rounded-l-4xl"
                  dropdownClass="!bg-[#071e52] !text-white !z-1000"
                />
              </div>
              <span
                id="errorPhone"
                className="hidden text-[#ff0000] text-sm mt-1 absolute left-5"
              >
                Ungültige Mobilnummer
              </span>
            </div>

            <FormInput
              parentClassName="w-10/12 max-w-md"
              wrapperClassName="w-10/12 max-w-md my-1.5"
              ref={emailRef}
              inputProps={{
                type: "text",
                placeholder: "E-Mail-Adress",
                onChange: (e) => setEmail(e.target.value),
                onKeyDown: onEnter(nextStep),
              }}
              inputClassName="js-slide-input pl-10.5"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  id="svgEmail"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4.5 z-1 absolute mx-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              }
              errorId="errorEmail"
              errorText="Ungültige E-Mail-Adress"
            />
          </SwiperSlide>
          <SwiperSlide
            data-step="password"
            className="h-full flex! flex-col items-center justify-center gap-3"
          >
            <FormInput
              ref={passRef}
              parentClassName="w-10/12 max-w-md"
              wrapperClassName="w-10/12 max-w-md my-1.5"
              inputProps={{
                type: "password",
                placeholder: "Passwort",
                onChange: (e) => setPassword(e.target.value),
                onKeyDown: onEnter(() => confirmRef.current?.focus()),
              }}
              inputClassName="js-slide-input pl-10"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  id="svgPass"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 z-10 absolute mx-4.5"
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
            <FormInput
              ref={confirmRef}
              parentClassName="w-10/12 max-w-md"
              wrapperClassName="w-10/12 max-w-md my-1.5"
              inputProps={{
                type: "password",
                placeholder: "Passwort bestätigen",
                onChange: (e) => setConfirm(e.target.value),
                onKeyDown: onEnter(nextStep),
              }}
              inputClassName="js-slide-input pl-10"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  id="svgConfimPass"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 z-10 absolute mx-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                  />
                </svg>
              }
              errorId="errorConfimPass"
              errorText="Passwörter nicht identisch!"
            />
          </SwiperSlide>
        </Swiper>

        {/* <div className="flex flex-row items-center text-center gap-1.5">
          <Checkbox
            id="stepVerfyId"
            onChange={(e) => setTwoFactor(e.target.checked)}
          />
          <label htmlFor="stepVerfyId">Sichere Anmeldung (2FA)</label>
        </div> */}
        <div className="w-4/12 relative">
          {/* btn s */}
          <div className="z-20 flex gap-6">
            <button
              type="button"
              disabled={isBeginning}
              onClick={() => swiperRef.current?.slidePrev()}
              className={`w-2/5 flex-1 py-3 transition-opacity duration-300 rounded-[10px] border backdrop-blur-sm
      ${isBeginning ? "hidden user-select-none" : ""}
    `}
            >
              Zurück
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (isEnd) {
                  checkInput();
                } else {
                  swiperRef.current?.slideNext();
                }
              }}
              // onClick={nextStep}  // register before next
              className={`Button w-2/5 flex-1 py-3 rounded-[10px] backdrop-blur-sm
                ${loading ? "cursor-wait animate-pulse" : ""}`}
            >
              {isEnd
                ? loading
                  ? "Registrieren..."
                  : "Registrieren"
                : "Weiter"}
            </button>
          </div>
        </div>
        <span className="mt-1 2xl:mt-3">
          Bereits ein Konto?{" "}
          <Link to="/" className="text-blue-200">
            Hier anmelden
          </Link>
        </span>
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
        {/* <div className="w-full flex items-center 2xl:mt-4">
          <hr className="w-1/5 grow mt-1" />
          <span className="mx-3">oder weiter mit</span>
          <hr className="w-1/5 grow mt-1" />
        </div>
        <div className="flex gap-2.5 mt-0.75 2xl:mt-1.5">
          <SignIn_withGoogle />
        </div> */}
      </div>
    </>
  );
}

export default Signup;

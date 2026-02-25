import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
// import "./i18n/index.js";
import "./style.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BookingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BookingProvider>
  </StrictMode>,
);
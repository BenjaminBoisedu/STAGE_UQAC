import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./Routes/Routes.jsx";
import "./assets/Font.css";
import Header from "./Components/Header/Header.jsx";
import HeaderTop from "./Components/HeaderTop/HeaderTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeaderTop />
    <AppRoutes />
    <Header />
  </StrictMode>
);

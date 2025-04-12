import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./Routes/Routes.jsx";
import "./assets/Font.css";
import Header from "./Components/Header/Header.jsx";
import HeaderTop from "./Components/HeaderTop/HeaderTop.jsx";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HeaderTop />
        <AppRoutes />
        <Header />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

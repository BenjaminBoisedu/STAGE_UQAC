import React from "react";
import "./Login.css";
import Login_Form from "../../Components/Form/Login/Login_Form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirection vers la page d'accueil si déjà connecté
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <div className="title">
        <h1>Connexion</h1>
      </div>
      <Login_Form />
    </div>
  );
}

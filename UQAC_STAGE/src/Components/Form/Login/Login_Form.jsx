import React, { useState } from "react";
import "./Login_Form.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";

export default function Login_Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const { login, loginWithGoogle, error: authError } = useAuth();

  // Afficher l'erreur du contexte d'authentification ou l'erreur locale
  const error = authError || localError;

  // Fonction pour gérer la connexion avec Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/"); // Redirection vers la page d'accueil après connexion
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte d'authentification
      console.error("Erreur de connexion Google:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation du formulaire
    const validations = [
      { condition: !email, message: "L'adresse e-mail est requise" },
      {
        condition: !email.includes("@") || !email.includes("."),
        message: "Format d'email invalide",
      },
      { condition: !password, message: "Le mot de passe est requis" },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        setLocalError(validation.message);
        return;
      }
    }

    setLocalError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/"); // Redirection vers la page d'accueil après connexion
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte d'authentification
      console.error("Erreur de connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleForgotPassword = () => {
    // À implémenter: logique de mot de passe oublié
    console.log("Forgot password clicked");
  };

  return (
    <div className="login-form">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
            autoFocus
            placeholder="Entrez votre adresse e-mail"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            autoComplete="current-password"
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password"
          >
            Mot de passe oublié ?
          </button>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="remember" />
            Se souvenir de moi
          </label>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-login"
            disabled={loading}
          >
            <FaGoogle className="google-icon" />
          </button>
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
        <div className="form-group">
          <p>
            Pas encore de compte ?{" "}
            <a href="/register" className="register-link">
              Inscrivez-vous
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

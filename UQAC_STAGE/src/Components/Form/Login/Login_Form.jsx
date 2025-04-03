import React from "react";
import "./Login_Form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../../config/Firebase";
import { FaGoogle } from "react-icons/fa";

export default function Login_Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  // Fonction pour gérer la connexion avec Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Enregistrement du token dans le stockage local
      localStorage.setItem("token", user.accessToken);
      navigate("/"); // Redirection vers la page d'accueil après connexion
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      setError("Erreur de connexion avec Google");
    }
  };

  // Fonction pour gérer la connexion avec un compte email et mot de passe
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Enregistrement du token dans le stockage local
      localStorage.setItem("token", user.accessToken);
      navigate("/"); // Redirection vers la page d'accueil après connexion
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Erreur de connexion");
    }
  };

  // Fonction pour gérer la soumission du formulaire

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setError(validation.message);
        return;
      }
    }
    if (error) {
      setError("");
    }

    setError("");
    setLoading(true);
    await handleEmailLogin();
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleForgotPassword = () => {
    // Handle forgot password logic here
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
            autoFocus
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
          >
            <FaGoogle className="google-icon" />
          </button>
        </div>
        <button type="submit" disabled={loading}>
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

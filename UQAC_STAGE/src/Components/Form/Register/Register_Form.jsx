import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Uncomment if using Firebase
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/Firebase"; // Uncomment if using Firebase
import "./Register_Form.css";

export default function Register_Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validations = [
      {
        condition: password !== confirmPassword,
        message: "Les mots de passe ne correspondent pas",
      },
      {
        condition: password.length < 6,
        message: "Le mot de passe doit comporter au moins 6 caractères",
      },
      { condition: !name, message: "Le nom est requis" },
      { condition: !email, message: "L'adresse e-mail est requise" },
      {
        condition: !email.includes("@") || !email.includes("."),
        message: "Format d'email invalide",
      },
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

    try {
      // Création du compte utilisateur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Création du document utilisateur dans Firestore
      await setDoc(doc(db, "utilisateurs", userCredential.user.uid), {
        nom: name,
        email: email,
        dateCreation: new Date(),
        role: "utilisateur",
        bio: "",
        avatarURL: "",
        publications: [],
      });

      console.log("Utilisateur créé avec succès");
      navigate("/");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Cette adresse e-mail est déjà utilisée");
          break;
        case "auth/invalid-email":
          setError("Adresse e-mail invalide");
          break;
        case "auth/operation-not-allowed":
          setError("Inscription désactivée");
          break;
        case "auth/weak-password":
          setError("Le mot de passe doit comporter au moins 6 caractères");
          break;
        default:
          setError("Une erreur est survenue lors de l'inscription");
      }
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
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="register-form">
      <h1>Inscription</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Entrez votre nom"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            autoFocus
            required
            placeholder="Entrez votre adresse e-mail"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            autoFocus
            required
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            placeholder="Confirmez votre mot de passe"
            autoComplete="current-password"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="remember" />
            Se souvenir de moi
          </label>
        </div>
        <div className="form-group">
          <p>
            Vous avez déjà un compte ?{" "}
            <a href="/login" className="login-link">
              Connectez-vous
            </a>
          </p>
        </div>
        <div className="form-group">
          <button
            type="button"
            className="google-auth-button"
            onClick={() => {}}
          >
            S'inscrire avec Google
          </button>
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

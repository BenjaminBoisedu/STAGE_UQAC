import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/Firebase";
import "./Settings.css";

export default function Settings() {
  const { currentUser, userData, fetchUserData } = useAuth();

  // États pour les formulaires
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // États pour gérer les messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Section active (profil, email, mot de passe)
  const [activeSection, setActiveSection] = useState("profile");

  // Initialiser les champs avec les données actuelles
  useEffect(() => {
    if (userData) {
      setDisplayName(userData.nom || "");
      setEmail(currentUser.email || "");
    }
  }, [userData, currentUser]);

  // Fonction de réauthentification (nécessaire pour les opérations sensibles)
  const reauthenticate = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      console.error("Erreur de réauthentification:", error);
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
      return false;
    }
  };

  // Mise à jour du nom d'affichage
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Mise à jour dans Firestore
      const userRef = doc(db, "utilisateurs", currentUser.uid);
      await updateDoc(userRef, {
        nom: displayName,
      });

      // Rafraîchir les données
      await fetchUserData(currentUser.uid);

      setSuccessMessage("Votre profil a été mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setErrorMessage(
        "Impossible de mettre à jour le profil. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour de l'email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Vérifier que le mot de passe actuel est fourni
    if (!currentPassword) {
      setErrorMessage("Veuillez entrer votre mot de passe actuel");
      setLoading(false);
      return;
    }

    try {
      // Réauthentifier l'utilisateur
      const isReauthenticated = await reauthenticate(currentPassword);
      if (!isReauthenticated) {
        setLoading(false);
        return;
      }

      // Mettre à jour l'email dans Firebase Auth
      await updateEmail(currentUser, email);

      // Mettre à jour l'email dans Firestore
      const userRef = doc(db, "utilisateurs", currentUser.uid);
      await updateDoc(userRef, { email });

      // Rafraîchir les données
      await fetchUserData(currentUser.uid);

      setSuccessMessage("Votre adresse e-mail a été mise à jour avec succès!");
      setCurrentPassword("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email:", error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMessage(
          "Cette adresse e-mail est déjà utilisée par un autre compte."
        );
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("L'adresse e-mail n'est pas valide.");
      } else {
        setErrorMessage(
          "Impossible de mettre à jour l'adresse e-mail. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour du mot de passe
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Vérifier que tous les champs sont remplis
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    // Vérifier la longueur du mot de passe
    if (newPassword.length < 6) {
      setErrorMessage(
        "Le nouveau mot de passe doit contenir au moins 6 caractères"
      );
      setLoading(false);
      return;
    }

    try {
      // Réauthentifier l'utilisateur
      const isReauthenticated = await reauthenticate(currentPassword);
      if (!isReauthenticated) {
        setLoading(false);
        return;
      }

      // Mettre à jour le mot de passe
      await updatePassword(currentUser, newPassword);

      setSuccessMessage("Votre mot de passe a été mis à jour avec succès!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setErrorMessage(
        "Impossible de mettre à jour le mot de passe. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Paramètres du profil</h1>

      <div className="settings-tabs">
        <button
          className={activeSection === "profile" ? "active" : ""}
          onClick={() => setActiveSection("profile")}
        >
          Profil
        </button>
        <button
          className={activeSection === "email" ? "active" : ""}
          onClick={() => setActiveSection("email")}
        >
          Adresse Email
        </button>
        <button
          className={activeSection === "password" ? "active" : ""}
          onClick={() => setActiveSection("password")}
        >
          Mot de passe
        </button>
      </div>

      {/* Messages de succès ou d'erreur */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Formulaire Profil */}
      {activeSection === "profile" && (
        <div className="settings-section">
          <h2>Informations de profil</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="displayName">Nom affiché</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour le profil"}
            </button>
          </form>
        </div>
      )}

      {/* Formulaire Email */}
      {activeSection === "email" && (
        <div className="settings-section">
          <h2>Modifier l'adresse email</h2>
          <form onSubmit={handleUpdateEmail}>
            <div className="form-group">
              <label htmlFor="email">Nouvelle adresse email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Entrez votre mot de passe actuel pour confirmer"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour l'email"}
            </button>
          </form>
        </div>
      )}

      {/* Formulaire Mot de passe */}
      {activeSection === "password" && (
        <div className="settings-section">
          <h2>Modifier le mot de passe</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label htmlFor="currentPasswordForPwd">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPasswordForPwd"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </form>
        </div>
      )}

      <div className="delete-account-link">
        <a href="/confirmationDeleteAccount">Supprimer mon compte</a>
      </div>
    </div>
  );
}

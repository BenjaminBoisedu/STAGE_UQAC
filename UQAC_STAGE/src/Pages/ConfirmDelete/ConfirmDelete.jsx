import React, { useState, useEffect } from "react";
import "./ConfirmDelete.css";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function ConfirmDelete() {
  const { deleteAccount, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  // Utiliser useEffect pour la redirection
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!currentUser) return null;

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!password) {
      setError(
        "Veuillez entrer votre mot de passe pour confirmer la suppression"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteAccount(password);
      navigate("/account-deleted"); // Redirection après suppression réussie
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err.message || "Erreur lors de la suppression du compte");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="confirm-delete">
      <h1>Suppression du compte</h1>
      <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
      <p className="warning">
        Cette action est irréversible. Toutes vos données seront définitivement
        supprimées.
      </p>

      <form onSubmit={handleDeleteAccount}>
        <div className="form-group">
          <label htmlFor="password">
            Pour confirmer, veuillez saisir votre mot de passe :
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Annuler
          </button>
          <button type="submit" className="delete-button" disabled={loading}>
            {loading ? "Suppression..." : "Confirmer la suppression"}
          </button>
        </div>
      </form>
    </div>
  );
}

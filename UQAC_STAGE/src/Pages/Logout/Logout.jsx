import React from "react";
import "./Logout.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h2 className="logout-title">Vous souhaitez vous deconnecter ?</h2>
        <p className="logout-text">
          Une inactivité de plus de 30 jours, se suivra d’une désactivation de
          compte, pour changer ce délai, dirigez vous vers paramètres - comptes
          - inactivité.
        </p>
        <div className="cta">
          <button className="cancel-button" onClick={handleCancel}>
            <a href="/profile">Annuler</a>
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <a href="/">Se déconnecter</a>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import "./Logout.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h2>Vous souhaitez vous deconnecter ?</h2>
        <p>
          Une inactivité de plus de 30 jours, se suivra d’une désactivation de{" "}
          <br />
          compte, pour changer ce délai, dirigez vous vers paramètres - comptes{" "}
          <br />
          -inactivité.
        </p>
        <div className="cta">
          <button className="cancel-button" onClick={handleCancel}>
            <a href="/profile">Annuler</a>
          </button>
          <button onClick={handleLogout}>
            <a href="/">Se déconnecter</a>
          </button>
        </div>
      </div>
    </div>
  );
}

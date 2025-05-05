import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "./DropDownMenu.css";
import { IoMdSettings } from "react-icons/io";

export default function DropDownMenu() {
  const { deleteAccount, userData } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fonction pour ouvrir/fermer le menu déroulant
  const handleMenuClick = (event) => {
    event.stopPropagation();
    dropdownRef.current.classList.toggle("show");
  };

  // Fermer le menu si on clique ailleurs sur la page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.classList.remove("show");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      // Utiliser la fonction de déconnexion du contexte
      dropdownRef.current.classList.remove("show");
      navigate("/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Redirection vers la page des paramètres du compte
  const handleAccountSettings = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropdownRef.current.classList.remove("show");
    navigate("/profile/settings");
  };

  // Fonction pour gérer la suppression du compte
  const handleDeleteAccount = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      try {
        // Utiliser la fonction de suppression du contexte
        navigate("/confirmationDeleteAccount");
        dropdownRef.current.classList.remove("show");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
      }
    }
  };

  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={handleMenuClick}>
        <IoMdSettings className="settings-icon" size={20} color="#000" />
      </button>
      <div className="dropdown-menu" ref={dropdownRef}>
        <a href="#" onClick={handleAccountSettings}>
          Paramètres du Compte
        </a>
        <a href="#" onClick={handleLogout}>
          Déconnexion
        </a>
        <a href="#" onClick={handleDeleteAccount}>
          Supprimer le Compte
        </a>
      </div>
    </div>
  );
}

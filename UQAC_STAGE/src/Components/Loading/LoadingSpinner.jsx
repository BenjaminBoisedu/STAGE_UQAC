import React from "react";
import "./LoadingSpinner.css"; // Assurez-vous d'importer le fichier CSS pour le style

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Chargement...</p>
    </div>
  );
}

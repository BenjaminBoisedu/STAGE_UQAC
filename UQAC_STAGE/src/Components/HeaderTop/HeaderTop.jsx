import React from "react";
import "./HeaderTop.css"; // Assurez-vous d'importer le fichier CSS pour le style

export default function HeaderTop() {
  return (
    <header className="home__header">
      <h1 className="Site__title">Prism</h1>
      <div className="Logo">
        <img src="/assets/Logo/Logo_Stage.svg" alt="" />
      </div>
    </header>
  );
}

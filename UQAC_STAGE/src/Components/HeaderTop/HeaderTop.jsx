import React from "react";
import "./HeaderTop.css"; // Assurez-vous d'importer le fichier CSS pour le style
import { Link } from "react-router-dom";

export default function HeaderTop() {
  return (
    <header className="home__header">
      <h1 className="Site__title">Prism</h1>
      <div className="Logo">
        <Link to="/">
          <img src="/assets/Logo/Logo_Stage.svg" alt="" />
        </Link>
      </div>
    </header>
  );
}

import React from "react";
import Header from "../../Components/Header/Header";
import HeaderTop from "../../Components/HeaderTop/HeaderTop";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <main className="home__content">
        <h1>Bienvenue sur la page d'accueil</h1>
        <p>Ceci est le contenu de la page d'accueil.</p>
      </main>
    </div>
  );
}

import React from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img src="/assets/404/404.svg" alt="" />
      <h1>La page que vous recherchez n'existe pas</h1>
      <div className="cta">
        <a href="/" className="cta-button">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./UserPublications.css";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { db } from "../../config/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
} from "firebase/firestore";

export default function UserPublications() {
  const [publications, setPublications] = useState([]);
  const [videos, setVideos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("articles");

  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      console.log(
        "[UserPublications] Utilisateur non authentifié ou ID manquant, arrêt du chargement"
      );
      setLoading(false);
      return;
    }

    const fetchUserContent = async () => {
      console.log(
        "[UserPublications] Début du chargement des publications pour userId:",
        userId
      );
      setLoading(true);
      setError(null);

      try {
        // Créer une référence à l'utilisateur
        const userRef = doc(db, "utilisateurs", userId);
        console.log("[UserPublications] Référence utilisateur:", userRef.path);

        // Récupérer les articles (Publications)
        const articlesQuery = query(
          collection(db, "Publications"),
          where("auteurId", "==", userRef)
        );

        // Récupérer les vidéos
        const videosQuery = query(
          collection(db, "Vidéo"),
          where("auteurId", "==", userRef)
        );

        // Récupérer les applications
        const applicationsQuery = query(
          collection(db, "Applications"),
          where("auteurId", "==", userRef)
        );

        console.log("[UserPublications] Exécution des requêtes");

        // Exécuter les requêtes en parallèle
        const [articlesSnapshot, videosSnapshot, applicationsSnapshot] =
          await Promise.all([
            getDocs(articlesQuery),
            getDocs(videosQuery),
            getDocs(applicationsQuery),
          ]);

        // Traiter les résultats
        const articlesList = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "article",
        }));
        console.log(
          "[UserPublications] Articles récupérés:",
          articlesList.length
        );

        const videosList = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "video",
        }));
        console.log("[UserPublications] Vidéos récupérées:", videosList.length);

        const applicationsList = applicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "application",
        }));
        console.log(
          "[UserPublications] Applications récupérées:",
          applicationsList.length
        );

        // Mettre à jour l'état
        setPublications(articlesList);
        setVideos(videosList);
        setApplications(applicationsList);
      } catch (err) {
        console.error("[UserPublications] Erreur globale:", err);
        setError("Impossible de charger les publications");
      } finally {
        console.log("[UserPublications] Fin du chargement");
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [userId, isAuthenticated]);

  // Contenu actif en fonction de l'onglet sélectionné
  const activeContent = () => {
    switch (activeTab) {
      case "articles":
        return publications;
      case "videos":
        return videos;
      case "applications":
        return applications;
      default:
        return publications;
    }
  };

  // Rendu du contenu
  const renderContent = () => {
    const content = activeContent();
    console.log(
      "[UserPublications] Rendu du contenu, nombre d'éléments:",
      content.length
    );

    if (!content || content.length === 0) {
      return <div className="no-content">Aucune publication trouvée.</div>;
    }

    return (
      <div className="content-grid">
        {content.map((item) => {
          console.log(
            "[UserPublications] Rendu de l'élément:",
            item.id,
            item.titre
          );
          return (
            <div key={item.id} className="content-card">
              {item.imageURL && (
                <div className="content-image">
                  <img src={item.imageURL} alt={item.titre || "Publication"} />
                </div>
              )}
              <div className="content-details">
                <h3>{item.titre || "Sans titre"}</h3>
                <p className="content-description">
                  {item.description?.substring(0, 100) || "Pas de description"}
                  {item.description && item.description.length > 100
                    ? "..."
                    : ""}
                </p>
                <Link to={`/${activeTab}/${item.id}`} className="view-button">
                  Voir{" "}
                  {activeTab === "articles"
                    ? "l'article"
                    : activeTab === "videos"
                    ? "la vidéo"
                    : "l'application"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return (
      <div className="loading-spinner">Chargement des publications...</div>
    );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-publication">
      <h2>Mes Publications</h2>

      <div className="publications-tabs">
        <button
          className={`tab-button ${activeTab === "articles" ? "active" : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          Articles ({publications.length})
        </button>
        <button
          className={`tab-button ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Vidéos ({videos.length})
        </button>
        <button
          className={`tab-button ${
            activeTab === "applications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications ({applications.length})
        </button>
      </div>

      <div className="publications-content">{renderContent()}</div>
    </div>
  );
}

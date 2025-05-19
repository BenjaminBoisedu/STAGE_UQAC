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
  doc,
  deleteDoc
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
      setLoading(false);
      return;
    }

    const fetchUserContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const userRef = doc(db, "utilisateurs", userId);

        const articlesQuery = query(
          collection(db, "Publications"),
          where("auteurId", "==", userRef)
        );
        const videosQuery = query(
          collection(db, "Vidéo"),
          where("auteurId", "==", userRef)
        );
        const applicationsQuery = query(
          collection(db, "Applications"),
          where("auteurId", "==", userRef)
        );

        const [articlesSnapshot, videosSnapshot, applicationsSnapshot] =
          await Promise.all([
            getDocs(articlesQuery),
            getDocs(videosQuery),
            getDocs(applicationsQuery),
          ]);

        const articlesList = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "article",
        }));
        const videosList = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "video",
        }));
        const applicationsList = applicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "application",
        }));

        setPublications(articlesList);
        setVideos(videosList);
        setApplications(applicationsList);
      } catch (err) {
        setError("Impossible de charger les publications");
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [userId, isAuthenticated]);

  const handleDelete = async (item) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette publication ?");
    if (!confirm) return;

    const collectionName =
      item.type === "video"
        ? "Vidéo"
        : item.type === "application"
        ? "Applications"
        : "Publications";

    try {
      await deleteDoc(doc(db, collectionName, item.id));
      if (item.type === "article") {
        setPublications((prev) => prev.filter((a) => a.id !== item.id));
      } else if (item.type === "video") {
        setVideos((prev) => prev.filter((v) => v.id !== item.id));
      } else {
        setApplications((prev) => prev.filter((a) => a.id !== item.id));
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

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

  const renderContent = () => {
    const content = activeContent();

    if (!content || content.length === 0) {
      return <div className="no-content">Aucune publication trouvée.</div>;
    }

    return (
      <div className="content-grid">
        {content.map((item) => (
          <div key={item.id} className="content-card">
            <div className="content-header">
              <h3>{item.titre || "Sans titre"}</h3>
              <button className="delete-button" onClick={() => handleDelete(item)} title="Supprimer">🗑️</button>
            </div>
            {item.imageURL && (
              <div className="content-image">
                <img src={item.imageURL} alt={item.titre || "Publication"} />
              </div>
            )}
            <div className="content-details">
              <p className="content-description">
                {item.description || item.descritpion || "Pas de description"}
              </p>
              <Link to={`/${activeTab}/${item.id}`} className="view-button">
                Voir {item.type === "article" ? "l'article" : item.type === "video" ? "la vidéo" : "l'application"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading)
    return <div className="loading-spinner">Chargement des publications...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-publication" style={{ maxHeight: "80vh", overflowY: "auto" }}>
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
          className={`tab-button ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          Applications ({applications.length})
        </button>
      </div>

      <div className="publications-content">{renderContent()}</div>
    </div>
  );
}

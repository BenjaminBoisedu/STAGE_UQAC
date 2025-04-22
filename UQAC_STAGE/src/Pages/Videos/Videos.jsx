import React, { useState, useEffect } from "react";
import "./Videos.css";
import { getCollection } from "../../services/FirebaseOperations";
import { Link } from "react-router-dom";
import { db } from "../../config/Firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer toutes les catégories d'abord
        const categoriesSnapshot = await getDocs(collection(db, "catégories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ref: doc.ref,
          ...doc.data(),
        }));
        console.log("[Videos] Catégories récupérées:", categoriesData);
        setCategories(categoriesData);

        // Récupérer les vidéos
        console.log("[Videos] Récupération des vidéos");
        const videosData = await getCollection("Vidéo");
        console.log("[Videos] Vidéos récupérées:", videosData);

        if (!videosData || videosData.length === 0) {
          console.log("[Videos] Aucune vidéo trouvée");
          setIsEmpty(true);
          setLoading(false);
          return;
        }

        // Récupérer les détails pour chaque vidéo
        const videosWithDetails = await Promise.all(
          videosData.map(async (video) => {
            console.log(
              "[Videos] Traitement de la vidéo:",
              video.id,
              video.titre,
              video.catégories
            );
            // Créer une copie de la vidéo pour y ajouter les données
            const videoWithDetails = { ...video };

            // Récupérer les tags si ils existent
            if (
              video.tags &&
              Array.isArray(video.tags) &&
              video.tags.length > 0
            ) {
              try {
                const tagsDetails = await Promise.all(
                  video.tags.map(async (tagRef) => {
                    if (tagRef && tagRef.path) {
                      const tagDocRef = doc(db, tagRef.path);
                      const tagSnap = await getDoc(tagDocRef);

                      if (tagSnap.exists()) {
                        return {
                          id: tagSnap.id,
                          ...tagSnap.data(),
                        };
                      }
                    }
                    return null;
                  })
                );

                // Filtrer les tags nuls (qui n'ont pas pu être récupérés)
                videoWithDetails.tagsDetails = tagsDetails.filter(
                  (tag) => tag !== null
                );
              } catch (err) {
                console.error(
                  "[Videos] Erreur lors de la récupération des tags:",
                  err
                );
                videoWithDetails.tagsDetails = [];
              }
            } else {
              videoWithDetails.tagsDetails = [];
            }

            return videoWithDetails;
          })
        );
        setVideos(videosWithDetails);
      } catch (error) {
        console.error("[Videos] Erreur globale:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Vérification des données après mise à jour
  useEffect(() => {
    console.log("[Videos] État des vidéos après mise à jour:", videos);
  }, [videos]);

  return (
    <div className="videos-container">
      <h1>Vidéos</h1>
      <p>Liste des vidéos disponibles</p>

      {loading && <div className="loading">Chargement des vidéos...</div>}
      {error && <div className="error">Erreur: {error.message}</div>}
      {isEmpty && <div className="empty">Aucune vidéo trouvée.</div>}

      {!loading && !error && !isEmpty && (
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              {video.imageURL && (
                <div className="video-thumbnail">
                  <img src={video.imageURL} alt={video.titre} />
                </div>
              )}
              <div className="video-content">
                <h2>{video.titre}</h2>
                <p className="video-description">{video.description}</p>
                <p className="video-category"></p>
                <span className="label">Catégorie:</span>
                <span className="category-name">
                  {video.categorieDetails
                    ? video.categorieDetails.nom
                    : "Non spécifiée"}
                </span>

                {/* Afficher la date de publication */}

                {/* Afficher les tags */}
                {video.tagsDetails && video.tagsDetails.length > 0 && (
                  <div className="video-tags">
                    <span className="label">Tags:</span>
                    <div className="tags-container">
                      {video.tagsDetails.map((tag) => (
                        <span key={tag.id} className="tag-badge">
                          {tag.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link to={`/videos/${video.id}`} className="view-video-btn">
                  Voir la vidéo
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

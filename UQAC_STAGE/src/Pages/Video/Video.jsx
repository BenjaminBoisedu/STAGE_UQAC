import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/Firebase";
import { getDoc, doc, getDocFromCache } from "firebase/firestore";
import "./Video.css";
export default function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoRef = doc(db, "Vidéo", id);
        const videoSnap = await getDoc(videoRef);

        if (!videoSnap.exists()) {
          setVideo(null);
          setLoading(false);
          return;
        }

        const data = videoSnap.data();

        // Charger les noms des catégories (références)
        const categoryNames = await Promise.all(
          (data.catégories || []).map(async (ref) => {
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data().nom : "Catégorie inconnue";
          })
        );

        setVideo({ ...data, id });
        setCategories(categoryNames);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement de la vidéo :", error);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const isYouTubeLink = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const extractYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) return <div>Chargement de la vidéo...</div>;
  if (!video) return <div>Vidéo non trouvée.</div>;

  return (
    <div className="video-detail">
      <h2>{video.titre}</h2>

      {isYouTubeLink(video.lien) ? (
        <div className="video-responsive">
        <iframe
          src={`https://www.youtube.com/embed/${extractYouTubeId(video.lien)}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      ) : (
        <a href={video.lien} target="_blank" rel="noopener noreferrer">
          Voir la vidéo
        </a>
      )}

      <div className="categories">
        {categories.length > 0 ? (
          categories.map((name, i) => (
            <span key={i} className="category-tag">
              {name}
            </span>
          ))
        ) : (
          <span>Aucune catégorie</span>
        )}
      </div>
    </div>
  );
}

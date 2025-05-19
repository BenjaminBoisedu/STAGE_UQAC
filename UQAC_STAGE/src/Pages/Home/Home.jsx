import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import "./Home.css";

export default function Home() {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [secondaryArticle, setSecondaryArticle] = useState(null);

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleSnap = await getDocs(
          query(collection(db, "Publications"), orderBy("datePublication", "desc"), limit(2))
        );
        const articles = articleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedArticle(articles[0]);
        setSecondaryArticle(articles[1]);

        const videoSnap = await getDocs(
          query(collection(db, "Vidéo"), orderBy("datePublication", "desc"), limit(2))
        );
        setRecentVideos(videoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erreur chargement page d’accueil:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      {/* Article en haut */}
      {featuredArticle && (
        <section className="featured-article">
          {featuredArticle.image && <img src={featuredArticle.image} alt="visuel article" />}
          <div>
            <h2>{featuredArticle.titre}</h2>
            <p>{featuredArticle.description}</p>
            <p className="author">{featuredArticle.auteur || "Auteur inconnu"}</p>
            <Link to={`/articles/${featuredArticle.id}`}>Lire plus</Link>
          </div>
        </section>
      )}

      {/* Vidéos */}
      <section className="video-row">
        {recentVideos.map(video => (
          extractYouTubeId(video.lien) && (
            <Link key={video.id} to={`/videos/${video.id}`} className="video-card">
              <img src={getYouTubeThumbnail(video.lien)} alt={video.titre} />
            </Link>
          )
        ))}
      </section>

      {/* Article secondaire */}
      {secondaryArticle && (
        <section className="secondary-article">
          {secondaryArticle.image && <img src={secondaryArticle.image} alt="visuel" />}
          <div>
            <h2>{secondaryArticle.titre}</h2>
            <p>{secondaryArticle.description}</p>
            <p className="author">{secondaryArticle.auteur || "Auteur inconnu"}</p>
            <Link to={`/articles/${secondaryArticle.id}`}>Lire plus</Link>
          </div>
        </section>
      )}
    </div>
  );
}

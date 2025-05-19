import React, { useEffect, useState } from "react";
import "./Applications.css";
import { db } from "../../config/Firebase";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Applications() {
  const [content, setContent] = useState([]);
  const [mode, setMode] = useState("recent");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const vuesRef = collection(db, "historique");
        const now = Timestamp.now();
        const oneWeekAgo = Timestamp.fromMillis(now.toMillis() - 7 * 24 * 60 * 60 * 1000);

        const vuesQuery = query(vuesRef, where("date", ">=", oneWeekAgo));
        const vuesSnap = await getDocs(vuesQuery);

        const vueCounts = {};
        vuesSnap.forEach((doc) => {
          const data = doc.data();
          const refPath = data.contenuId.path;
          const id = refPath.split("/").pop();
          if (!vueCounts[id]) {
            vueCounts[id] = { refPath: data.contenuId.path, dates: [] };
          }
          vueCounts[id].dates.push(data.date);
        });

        const items = Object.values(vueCounts);

        let sortedItems = [];
        if (mode === "recent") {
          sortedItems = items
            .sort((a, b) => b.dates[b.dates.length - 1].seconds - a.dates[a.dates.length - 1].seconds)
            .slice(0, 10);
        } else if (mode === "popular") {
          sortedItems = items
            .sort((a, b) => b.dates.length - a.dates.length)
            .slice(0, 10);
        }

        const finalContent = [];
        for (let item of sortedItems) {
          const [collectionName, docId] = item.refPath.split("/").slice(-2);
          const snap = await getDoc(doc(db, collectionName, docId));
          if (snap.exists()) {
            finalContent.push({ id: snap.id, collection: collectionName, ...snap.data() });
          }
        }

        setContent(finalContent);
      } catch (error) {
        console.error("Erreur lors du chargement des contenus:", error);
      }
    };

    fetchContent();
  }, [mode]);

  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    const id = match ? match[1] : null;
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  return (
    <div className="applications-container">
      <div className="applications-filters">
        <button onClick={() => setMode("recent")} className={mode === "recent" ? "active" : ""}>Récemment consultés</button>
        <button onClick={() => setMode("popular")} className={mode === "popular" ? "active" : ""}>Populaires</button>
      </div>

      <main className="applications-grid">
        {content.map((item) => (
          <Link
            to={item.lien ? `/videos/${item.id}` : `/articles/${item.id}`}
            key={item.id}
            className="app-thumbnail"
          >
            {item.lien && item.collection === "videos" && getYouTubeThumbnail(item.lien) ? (
              <img
                src={getYouTubeThumbnail(item.lien)}
                alt={item.titre}
              />
            ) : item.image ? (
              <img src={item.image} alt={item.titre} />
            ) : (
              <div className="article-title-block">
                <span>{item.titre}</span>
              </div>
            )}
          </Link>
        ))}
      </main>
    </div>
  );
}

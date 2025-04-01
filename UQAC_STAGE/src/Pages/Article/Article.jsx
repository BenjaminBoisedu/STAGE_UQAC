import React from "react";
import { useState, useEffect } from "react";
import { getCollection } from "../../services/FirebaseOperations";
import "./Article.css";

export default function Article() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getCollection("Publications");
        if (data.length === 0) {
          setIsEmpty(true);
        }
        setArticles(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des articles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="articles-container">
      <h1>Articles</h1>

      {loading && <p>Chargement des articles...</p>}

      {error && (
        <div className="error-message">
          <p>Erreur lors du chargement des articles: {error}</p>
        </div>
      )}

      {isEmpty && (
        <div className="empty-message">
          <p>Aucun article n'est disponible pour le moment.</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="articles-grid">
          {articles.map((article) => (
            <article key={article.id} className="article-card">
              <h2>{article.titre}</h2>
              <p>{article.description}</p>
              <div className="article-metadata">
                <span>Publié le : {formatDate(article.datePublication)}</span>
                <span>Auteur : {article.auteur || "Anonyme"}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

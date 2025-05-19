import React from "react";
import { useState, useEffect } from "react";
import { getCollection } from "../../services/FirebaseOperations";
import { Link } from "react-router-dom";
import "./Articles.css";


export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = await getCollection("Publications");
        if (!articlesData || articlesData.length === 0) {
          setIsEmpty(true);
          return;
        }

        const user = await getCollection("utilisateurs");
        if (!user || user.length === 0) {
          setIsEmpty(true);
          return;
        }

        const tagsData = await getCollection("tag");
        if (!tagsData || tagsData.length === 0) {
          setIsEmpty(true);
          return;
        }

        // J'ai besoin de faire une requête pour chaque article pour récupérer les tags
        const articlesWithTags = await Promise.all(
          articlesData.map(async (article) => {
            const articleTags = await Promise.all(
              article.tags.map(async (tagId) => {
                const tag = tagsData.find((t) => t.id === tagId);
                return tag ? { id: tag.id, nom: tag.nom } : null;
              })
            );
            return { ...article, tags: articleTags.filter(Boolean) };
          })
        );
        setTags(tagsData);

        // J'ai besoin de faire une requête pour chaque article pour récupérer l'auteur
        const articlesWithAuthors = articlesWithTags.map((article) => {
          const author = user.find((u) => u.id === article.auteurId?.id);
          return {
            ...article,
            auteur: author?.nom || "Anonyme",
          };
        });

        setTags(tagsData);
        setUser(user);
        setArticles(articlesWithAuthors); // Utiliser articlesWithAuthors au lieu de articlesData
        setIsEmpty(false);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (firestoreDate) => {
    if (!firestoreDate) return "";
    const date = firestoreDate.toDate();
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className="loading">Chargement de l'article...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (isEmpty || !articles)
    return <div className="empty">Aucun article trouvé.</div>;

  return (
    <div className="articles-container">
      <h1>Articles</h1>
      <Link to="/articles/ajouter" className="add-article-button">+ Ajouter un article</Link>

      {loading && <div className="loading">Chargement...</div>}
      {error && <div className="error">Erreur: {error}</div>}
      {isEmpty && <div className="empty">Aucun article trouvé.</div>}
      {!loading && !error && !isEmpty && (
        <div>
          {articles.map((article, index) => (
            <div key={article.id} className="article-card" index={index}>
              <div className="content">
                <h2>{article.titre}</h2>
                <p>{article.description}</p>
                <div className="articles__postData">
                  <p>Auteur: {article.auteur}</p>
                  <p>Date: {formatDate(article.datePublication)}</p>
                </div>
                <div className="tags">
                  {tags.map((tag) => (
                    <span key={tag.id} className="tag">
                      {tag.nom}
                    </span>
                  ))}
                </div>
                <Link to={`/articles/${article.id}`}>Lire la suite</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

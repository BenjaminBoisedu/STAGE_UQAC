import React from "react";
import { useParams } from "react-router-dom";
import { useArticleWithTags } from "../../hooks/useArticleWithTags";
import "./Article.css";

export default function Article() {
  const { id } = useParams();
  const { article, tags, loading, error, isEmpty } = useArticleWithTags(id);

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
  if (isEmpty || !article)
    return <div className="empty">Aucun article trouvé.</div>;

  return (
    <div className="articles-container">
      <div className="article-content">
        <h1>{article.titre}</h1>
        <div className="thumbnail">
          <img src={article.image} alt={article.titre} />
        </div>
        <div className="content">
          <p>{article.description}</p>
          <p>Auteur: {article.auteur}</p>
          <p>Date: {formatDate(article.datePublication)}</p>
          <div className="tags">
            {tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.nom}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

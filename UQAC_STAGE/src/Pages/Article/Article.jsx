import React, { useState, useEffect } from "react";
import { getDocumentById } from "../../services/ArticlesServices/GetDocuments";
import { getCollection } from "../../services/FirebaseOperations";
import { useParams } from "react-router-dom";
import "./Article.css";

export default function Article() {
  const [article, setArticle] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'article
        const articleData = await getDocumentById("Publications", id);
        if (!articleData) {
          setIsEmpty(true);
          return;
        }

        // Récupérer tous les tags
        const allTags = await getCollection("tag");
        console.log("Tous les tags disponibles:", allTags);

        // Vérifier si l'article a des tags
        if (articleData.tags && articleData.tags.length > 0) {
          console.log("Tag Article:", articleData.tags[0].id);

          // Comparer les tags de l'article avec tous les tags
          const filteredTags = allTags.filter((tag) => {
            return articleData.tags.some(
              (articleTag) => articleTag.id === tag.id
            );
          });
          console.log("Filtered Tags:", filteredTags);
        }

        // Mettre à jour l'état avec les données de l'article et les tags
        setTags(allTags);
        setArticle(articleData);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading">Chargement de l'article...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  if (isEmpty) {
    return <div className="empty">Aucun article trouvé.</div>;
  }

  if (!article) {
    return <div className="empty">Aucun article trouvé.</div>;
  }
  console.log("Article:", article);
  console.log("Tags:", tags);
  const formatDate = (firestoreDate) => {
    if (!firestoreDate) return "";

    // Conversion du timestamp Firestore en Date
    const date = firestoreDate.toDate();

    // Formatage de la date en français
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="articles-container">
      {article && (
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
              {article.tags &&
                article.tags.map((tag, index) => (
                  <li key={index}>
                    {tags.find((t) => t.id === tag.id)?.nom || "Tag inconnu"}
                  </li>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

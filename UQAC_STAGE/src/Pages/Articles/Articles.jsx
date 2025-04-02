import React from "react";
import { useState, useEffect } from "react";
import { getCollection } from "../../services/FirebaseOperations";
import { Link } from "react-router-dom";

export default function Articles() {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  console.log("Articles:", articles);

  return (
    <div>
      <h1>Articles</h1>
      <p>Ceci est le contenu de la page Articles.</p>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {isEmpty && <p>Aucun article trouvé.</p>}
      {!loading && !error && !isEmpty && (
        <div>
          {articles.map((article, index) => (
            <div key={index}>
              <div className="thumbnail">
                <img src={article.image} alt={article.titre} />
              </div>
              <div className="content">
                <h2>{article.titre}</h2>
                <p>{article.description}</p>
                <p>Auteur: {article.auteur}</p>
                <p>
                  Date: {new Date(article.datePublication).toLocaleDateString()}
                </p>
                <p>Tags: {article.tags.join(", ")}</p>
                <Link to={`/articles/${article.id}`}>Lire la suite</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

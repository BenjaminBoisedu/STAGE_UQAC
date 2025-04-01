import React from "react";
import { useState, useEffect } from "react";
import { getCollection } from "../../services/FirebaseOperations";

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
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Is Empty:", isEmpty);

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
              <h2>{article.titre}</h2>
              <p>{article.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

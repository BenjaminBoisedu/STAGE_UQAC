import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/Firebase";
import "./Catégorie.css";

export default function AjouterCategorie() {
  const [nom, setNom] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "catégories"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nom.trim()) {
      setError("Le nom de la catégorie est requis.");
      return;
    }

    try {
      await addDoc(collection(db, "catégories"), {
        nom: nom.trim(),
      });
      setSuccess(true);
      setNom("");
      fetchCategories();
    } catch (err) {
      console.error("Erreur d'ajout:", err);
      setError("Une erreur est survenue lors de l'ajout.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "catégories", id));
      fetchCategories();
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError("Suppression impossible");
    }
  };

  return (
    <div className="ajouter-categorie-container">
      <h2>Ajouter une Catégorie</h2>
      <form onSubmit={handleSubmit} className="ajouter-categorie-form">
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom de la catégorie"
        />
        <button type="submit">Ajouter</button>
      </form>

      {success && <p className="success-message">Catégorie ajoutée avec succès !</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="liste-categories">
        <h3>Catégories existantes :</h3>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id} className="categorie-item">
              <span>{cat.nom}</span>
              <button onClick={() => handleDelete(cat.id)} className="btn-delete">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

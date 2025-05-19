import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/Firebase";
import "./Tags.css";

export default function AjouterTag() {
  const [nom, setNom] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const snapshot = await getDocs(collection(db, "tag"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTags(data);
    } catch (err) {
      console.error("Erreur lors du chargement des tags:", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nom.trim()) {
      setError("Le nom du tag est requis.");
      return;
    }

    try {
      await addDoc(collection(db, "tag"), {
        nom: nom.trim(),
      });
      setSuccess(true);
      setNom("");
      fetchTags();
    } catch (err) {
      console.error("Erreur d'ajout:", err);
      setError("Une erreur est survenue lors de l'ajout.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce tag ?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "tag", id));
      fetchTags();
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError("Suppression impossible");
    }
  };

  return (
    <div className="ajouter-categorie-container">
      <h2>Ajouter un Tag</h2>
      <form onSubmit={handleSubmit} className="ajouter-categorie-form">
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom du tag"
        />
        <button type="submit">Ajouter</button>
      </form>

      {success && <p className="success-message">Tag ajouté avec succès !</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="liste-categories">
        <h3>Tags existants :</h3>
        <ul>
          {tags.map((tag) => (
            <li key={tag.id} className="categorie-item">
              <span>{tag.nom}</span>
              <button onClick={() => handleDelete(tag.id)} className="btn-delete">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

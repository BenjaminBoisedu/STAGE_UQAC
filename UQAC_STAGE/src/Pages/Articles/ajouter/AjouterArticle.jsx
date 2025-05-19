import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import { db } from "../../../config/Firebase";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  getDocs
} from "firebase/firestore";
import "./AjouterArticle.css";

export default function AjouterArticle() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lien, setLien] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const tagsSnap = await getDocs(collection(db, "tag"));
      const catSnap = await getDocs(collection(db, "catégories"));
      setTags(tagsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCategories(catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Publications"), {
        titre,
        description,
        lien,
        datePublication: Timestamp.now(),
        type: "article",
        auteurId: doc(db, "utilisateurs", currentUser.uid),
        tags: selectedTags.map((tagId) => doc(db, "tag", tagId)),
        categories: selectedCategories.map((catId) => doc(db, "catégories", catId)),
        commentaires: []
      });

      navigate("/articles");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout de l'article.");
    }
  };

  return (
    <div className="ajouter-article-container">
      <h2>Ajouter un article</h2>
      <form onSubmit={handleSubmit} className="ajouter-article-form">
        <label>Titre</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <label>Lien</label>
        <input
          type="url"
          value={lien}
          onChange={(e) => setLien(e.target.value)}
        />

        <label>Catégories</label>
        <select multiple onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, o => o.value))}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>

        <label>Tags</label>
        <select multiple onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, o => o.value))}>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>{tag.nom}</option>
          ))}
        </select>

        <button type="submit">Publier</button>
      </form>
    </div>
  );
}

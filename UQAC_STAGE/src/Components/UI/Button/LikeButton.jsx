import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/Firebase";
import { useAuth } from "../../../contexts/AuthContext";

export default function LikeButton({ contenuId }) {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeDocId, setLikeDocId] = useState(null);

  useEffect(() => {
    if (loading) return;

    const fetchData = async () => {
      const likesRef = collection(db, "likes");

      // Compter tous les likes pour ce contenu
      const countQuery = query(likesRef, where("contenuId", "==", contenuId));
      const countSnap = await getDocs(countQuery);
      setLikesCount(countSnap.size);

      // Vérifier si l'utilisateur a déjà liké
      if (isAuthenticated && currentUser) {
        const userLikeQuery = query(
          likesRef,
          where("contenuId", "==", contenuId),
          where("utilisateurId", "==", currentUser.uid)
        );
        const userLikeSnap = await getDocs(userLikeQuery);

        if (!userLikeSnap.empty) {
          setHasLiked(true);
          setLikeDocId(userLikeSnap.docs[0].id);
        } else {
          setHasLiked(false);
          setLikeDocId(null);
        }
      }
    };

    fetchData();
  }, [contenuId, isAuthenticated, currentUser, loading]);

  const handleToggleLike = async () => {
    if (!isAuthenticated || !currentUser) return;

    const likesRef = collection(db, "likes");

    if (!hasLiked) {
      const docRef = await addDoc(likesRef, {
        contenuId,
        utilisateurId: currentUser.uid,
        dateLike: new Date(),
      });
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      setLikeDocId(docRef.id);
    } else if (likeDocId) {
      await deleteDoc(doc(db, "likes", likeDocId));
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
      setLikeDocId(null);
    }
  };

  if (loading) return <span>Chargement du bouton Like...</span>;

  return (
    <button onClick={handleToggleLike} disabled={!isAuthenticated}>
      {hasLiked ? "💔 Je n’aime plus" : "❤️ J’aime"}
      <span> ({likesCount})</span>
      {!isAuthenticated && <span> (connecte-toi pour liker)</span>}
    </button>
  );
}

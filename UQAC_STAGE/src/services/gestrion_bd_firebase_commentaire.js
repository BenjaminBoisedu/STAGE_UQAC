import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

import { increment } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export async function ajouterCommentaire(commentaireId, data) {
    const commentaireRef = doc(db, "commentaires", commentaireId);
    await setDoc(commentaireRef, {
      ...data,
      dateCommentaire: new Date().toISOString()
    });
  }
  

export async function getAllCommentaires() {
const commentairesRef = collection(db, "commentaires");
const snapshot = await getDocs(commentairesRef);
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCommentaireById(commentaireId) {
    const ref = doc(db, "commentaires", commentaireId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    else throw new Error("Commentaire introuvable");
  }

export async function updateCommentaire(commentaireId, newData) {
const ref = doc(db, "commentaires", commentaireId);
await updateDoc(ref, newData);
}

export async function deleteCommentaire(commentaireId) {
    await deleteDoc(doc(db, "commentaires", commentaireId));
  }

export async function getCommentairesByPublication(publicationId) {
const commentairesRef = collection(db, "commentaires");
const q = query(commentairesRef, where("contenuId", "==", doc(db, "Publications", publicationId)));
const snapshot = await getDocs(q);
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCommentairesByUtilisateur(userId) {
    const commentairesRef = collection(db, "commentaires");
    const q = query(commentairesRef, where("auteurId", "==", doc(db, "utilisateurs", userId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

import { increment } from "firebase/firestore";

export async function likerCommentaire(commentaireId) {
const ref = doc(db, "commentaires", commentaireId);
await updateDoc(ref, {
    nbLikes: increment(1)
});
}

export async function likerCommentaire(commentaireId) {
    const ref = doc(db, "commentaires", commentaireId);
    await updateDoc(ref, {
      nbLikes: increment(1)
    });
  }

export async function commentaireAppartientA(commentaireId, userId) {
const ref = doc(db, "commentaires", commentaireId);
const snap = await getDoc(ref);
if (!snap.exists()) return false;
const data = snap.data();
return data.auteurId.id === userId;
}

export async function creerCommentaireSimple(commentaireId, texte, utilisateurId, publicationId) {
    await ajouterCommentaire(commentaireId, {
      auteurId: doc(db, "utilisateurs", utilisateurId),
      contenuId: doc(db, "Publications", publicationId),
      texte: texte,
      nbLikes: 0
    });
  }



export function ecouterCommentairesParPublication(publicationId, callback) {
const q = query(
    collection(db, "commentaires"),
    where("contenuId", "==", doc(db, "Publications", publicationId))
);
return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
});
}
  
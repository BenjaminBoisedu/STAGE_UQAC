import { db } from "../../config/Firebase";
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


export async function ajouterUtilisateur(id, utilisateurData) {
  const userRef = doc(db, "utilisateurs", id);
  await setDoc(userRef, {
    ...utilisateurData,
    dateCreation: new Date().toISOString()
  });
}




export async function getAllUtilisateurs() {
  const usersRef = collection(db, "utilisateurs");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}



export async function getUtilisateurById(userId) {
  const userRef = doc(db, "utilisateurs", userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  } else {
    throw new Error("Utilisateur introuvable");
  }
}


export async function updateUtilisateur(userId, newData) {
  const userRef = doc(db, "utilisateurs", userId);
  await updateDoc(userRef, newData);
}


export async function deleteUtilisateur(userId) {
  const userRef = doc(db, "utilisateurs", userId);
  await deleteDoc(userRef);
}

export async function getPublicationsByUtilisateur(userId) {
  const userRef = doc(db, "utilisateurs", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const pubRefs = data.Publications || [];

    const pubsSnap = await Promise.all(pubRefs.map(ref => getDoc(ref)));
    return pubsSnap.map(p => ({ id: p.id, ...p.data() }));
  } else {
    throw new Error("Utilisateur introuvable");
  }
}

export async function getFichiersByUtilisateur(userId) {
  const fichiersRef = collection(db, "fichier");
  const q = query(fichiersRef, where("useId", "==", doc(db, "utilisateurs", userId)));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCommentairesByUtilisateur(userId) {
  const commentairesRef = collection(db, "commentaires");
  const q = query(commentairesRef, where("auteurId", "==", doc(db, "utilisateurs", userId)));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getLikesByUtilisateur(userId) {
  const likesRef = collection(db, "like");
  const q = query(likesRef, where("utilisateurId", "==", doc(db, "utilisateurs", userId)));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function utilisateurExiste(userId) {
  const userRef = doc(db, "utilisateurs", userId);
  const snap = await getDoc(userRef);
  return snap.exists();
}

export async function ajouterPublicationAUtilisateur(userId, publicationRef) {
  const userRef = doc(db, "utilisateurs", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const userData = snap.data();
  const publications = userData.Publications || [];

  await updateDoc(userRef, {
    Publications: [...publications, publicationRef]
  });
}

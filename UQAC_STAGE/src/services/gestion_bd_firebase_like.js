import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

export async function ajouterLike(utilisateurId, contenuId) {
    const likeId = `${utilisateurId}_${contenuId}`;
    const ref = doc(db, "like", likeId);
    await setDoc(ref, {
      id: likeId,
      utilisateurId: doc(db, "utilisateurs", utilisateurId),
      contenuId: doc(db, "Publications", contenuId),
      dateLike: new Date().toISOString()
    });
  }

export async function retirerLike(utilisateurId, contenuId) {
    const likeId = `${utilisateurId}_${contenuId}`;
    await deleteDoc(doc(db, "like", likeId));
}

export async function aDejaLike(utilisateurId, contenuId) {
    const likeId = `${utilisateurId}_${contenuId}`;
    const ref = doc(db, "like", likeId);
    const snap = await getDoc(ref);
    return snap.exists();
  }
 
export async function getLikesByUtilisateur(userId) {
    const likesRef = collection(db, "like");
    const q = query(likesRef, where("utilisateurId", "==", doc(db, "utilisateurs", userId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getLikesByContenu(contenuId) {
    const likesRef = collection(db, "like");
    const q = query(likesRef, where("contenuId", "==", doc(db, "Publications", contenuId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

export async function countLikes(contenuId) {
    const snapshot = await getLikesByContenu(contenuId);
    return snapshot.length;
}

export async function getAllLikes() {
    const snapshot = await getDocs(collection(db, "like"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
 
export function getLikeId(utilisateurId, contenuId) {
    return `${utilisateurId}_${contenuId}`;
}

export async function deleteLikesByContenu(contenuId) {
    const likes = await getLikesByContenu(contenuId);
    const deletions = likes.map(like => deleteDoc(doc(db, "like", like.id)));
    await Promise.all(deletions);
  }

export async function deleteLikesByUtilisateur(userId) {
    const likes = await getLikesByUtilisateur(userId);
    const deletions = likes.map(like => deleteDoc(doc(db, "like", like.id)));
    await Promise.all(deletions);
}


  
  
  
  
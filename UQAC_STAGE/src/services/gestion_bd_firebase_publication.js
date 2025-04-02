import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

import { increment } from "firebase/firestore";

export async function ajouterPublication(publicationId, data) {
    const ref = doc(db, "Publications", publicationId);
    await setDoc(ref, {
      ...data,
      datePublication: new Date().toISOString()
    });
  }

export async function getAllPublications() {
    const ref = collection(db, "Publications");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getPublicationById(publicationId) {
    const ref = doc(db, "Publications", publicationId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    else throw new Error("Publication introuvable");
  }

export async function updatePublication(publicationId, newData) {
    const ref = doc(db, "Publications", publicationId);
    await updateDoc(ref, newData);
}

export async function deletePublication(publicationId) {
    const ref = doc(db, "Publications", publicationId);
    await deleteDoc(ref);
  }

export async function ajouterCommentaireAPublication(publicationId, commentaireRef) {
    const ref = doc(db, "Publications", publicationId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        const data = snap.data();
        const commentaires = data.commentaires || [];
        await updateDoc(ref, {
        commentaires: [...commentaires, commentaireRef]
        });
    }
}

export async function ajouterTagAPublication(publicationId, tagId) {
    const ref = doc(db, "Publications", publicationId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
  
    const data = snap.data();
    const tags = data.tags || [];
  
    await updateDoc(ref, {
      tags: [...tags, doc(db, "tag", tagId)]
    });
  }

export async function ajouterCategorieAPublication(publicationId, categorieId) {
    const ref = doc(db, "Publications", publicationId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const categories = data.categories || [];

    await updateDoc(ref, {
        categories: [...categories, doc(db, "catégories", categorieId)]
    });
}

export async function getPublicationsByUtilisateur(userId) {
    const ref = collection(db, "Publications");
    const q = query(ref, where("auteurId", "==", doc(db, "utilisateurs", userId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }



export async function incrementerVues(publicationId) {
    const ref = doc(db, "Publications", publicationId);
    await updateDoc(ref, {
        nbVues: increment(1)
    });
}

export async function incrementerLikes(publicationId) {
    const ref = doc(db, "Publications", publicationId);
    await updateDoc(ref, {
        nbLikes: increment(1)
    });
}


export async function getPublicationsParTag(tagId) {
    const ref = collection(db, "Publications");
    const snapshot = await getDocs(ref);
  
    return snapshot.docs
      .filter(doc => {
        const tags = doc.data().tags || [];
        return tags.some(ref => ref.id === tagId);
      })
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }
  

export async function publicationAppartientA(publicationId, userId) {
    const snap = await getDoc(doc(db, "Publications", publicationId));
    if (!snap.exists()) return false;

    return snap.data().auteurId.id === userId;
}
  
  
  
  
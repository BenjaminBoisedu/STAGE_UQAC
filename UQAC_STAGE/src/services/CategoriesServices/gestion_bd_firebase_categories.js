import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import { getDocs } from "firebase/firestore";

export async function ajouterCategorie(categorieId, data) {
    const ref = doc(db, "catégories", categorieId);
    await setDoc(ref, {
      ...data
    });
  }

export async function getAllCategories() {
    const ref = collection(db, "catégories");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCategorieById(categorieId) {
    const ref = doc(db, "catégories", categorieId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    else throw new Error("Catégorie introuvable");
  }

export async function updateCategorie(categorieId, newData) {
    const ref = doc(db, "catégories", categorieId);
    await updateDoc(ref, newData);
}

export async function deleteCategorie(categorieId) {
    const ref = doc(db, "catégories", categorieId);
    await deleteDoc(ref);
  }
  
export async function ajouterCategorieAContenu(contenuId, categorieId) {
    const contenuRef = doc(db, "Publications", contenuId);
    const contenuSnap = await getDoc(contenuRef);
    if (!contenuSnap.exists()) return;

    const contenuData = contenuSnap.data();
    const categories = contenuData.categories || [];

    await updateDoc(contenuRef, {
        categories: [...categories, doc(db, "catégories", categorieId)]
    });
}

export async function getContenusParCategorie(categorieId) {
    const publicationsRef = collection(db, "Publications");
    const snapshot = await getDocs(publicationsRef);
  
    return snapshot.docs
      .filter(doc => {
        const categories = doc.data().categories || [];
        return categories.some(ref => ref.id === categorieId);
      })
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }
 
export async function categorieExiste(categorieId) {
    const ref = doc(db, "catégories", categorieId);
    const snap = await getDoc(ref);
    return snap.exists();
}


  
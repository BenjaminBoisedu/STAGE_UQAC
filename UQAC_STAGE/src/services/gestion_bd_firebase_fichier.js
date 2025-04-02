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
import { getStorage, ref, deleteObject } from "firebase/storage";

export async function ajouterFichier(fichierId, data) {
    const ref = doc(db, "fichier", fichierId);
    await setDoc(ref, {
      ...data,
      dateUpload: new Date().toISOString()
    });
  }

export async function getAllFichiers() {
    const fichiersRef = collection(db, "fichier");
    const snapshot = await getDocs(fichiersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getFichierById(fichierId) {
    const ref = doc(db, "fichier", fichierId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    else throw new Error("Fichier introuvable");
  }

export async function deleteFichier(fichierId) {
    const ref = doc(db, "fichier", fichierId);
    await deleteDoc(ref);
}

export async function updateFichier(fichierId, newData) {
    const ref = doc(db, "fichier", fichierId);
    await updateDoc(ref, newData);
  }

export async function getFichiersByUtilisateur(userId) {
    const fichiersRef = collection(db, "fichier");
    const q = query(fichiersRef, where("useId", "==", doc(db, "utilisateurs", userId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
  
export async function getFichiersByPublication(publicationId) {
    const fichiersRef = collection(db, "fichier");
    const q = query(fichiersRef, where("contenuId", "==", doc(db, "Publications", publicationId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  
export async function fichierAppartientA(fichierId, userId) {
    const ref = doc(db, "fichier", fichierId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;

    return snap.data().useId.id === userId;
}
 


export async function supprimerDuStorage(url) {
  const storage = getStorage();
  const decodedUrl = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
  const fileRef = ref(storage, decodedUrl);
  await deleteObject(fileRef);
}

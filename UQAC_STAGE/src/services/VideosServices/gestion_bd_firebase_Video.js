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

export async function ajouterVideo(videoId, data) {
    const ref = doc(db, "Vidéo", videoId);
    await setDoc(ref, {
      ...data,
      datePublication: new Date().toISOString()
    });
  }

export async function getAllVideos() {
    const ref = collection(db, "Vidéo");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getVideoById(videoId) {
    const ref = doc(db, "Vidéo", videoId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    else throw new Error("Vidéo introuvable");
  }

export async function updateVideo(videoId, newData) {
    const ref = doc(db, "Vidéo", videoId);
    await updateDoc(ref, newData);
}

export async function deleteVideo(videoId) {
    const ref = doc(db, "Vidéo", videoId);
    await deleteDoc(ref);
  }
  
export async function getVideosByUtilisateur(userId) {
    const videosRef = collection(db, "Vidéo");
    const q = query(videosRef, where("auteurId", "==", doc(db, "utilisateurs", userId)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export async function incrementerVuesVideo(videoId) {
  const ref = doc(db, "Vidéo", videoId);
  await updateDoc(ref, {
    nbVues: increment(1)
  });
}

export async function incrementerLikesVideo(videoId) {
  const ref = doc(db, "Vidéo", videoId);
  await updateDoc(ref, {
    nbLikes: increment(1)
  });
}

export async function ajouterTagAVideo(videoId, tagId) {
    const ref = doc(db, "Vidéo", videoId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
  
    const data = snap.data();
    const tags = data.tags || [];
  
    await updateDoc(ref, {
      tags: [...tags, doc(db, "tag", tagId)]
    });
  }
  
export async function ajouterCategorieAVideo(videoId, categorieId) {
    const ref = doc(db, "Vidéo", videoId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const categories = data.categories || [];

    await updateDoc(ref, {
        categories: [...categories, doc(db, "catégories", categorieId)]
    });
}
  
export async function getVideosByTag(tagId) {
    const ref = collection(db, "Vidéo");
    const snapshot = await getDocs(ref);
  
    return snapshot.docs
      .filter(doc => {
        const tags = doc.data().tags || [];
        return tags.some(ref => ref.id === tagId);
      })
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }
  

  
  
  
import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

export async function ajouterTag(tagId, data) {
    const ref = doc(db, "tag", tagId);
    await setDoc(ref, {
      ...data
    });
  }

export async function getAllTags() {
    const ref = collection(db, "tag");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getTagById(tagId) {
    const ref = doc(db, "tag", tagId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    else throw new Error("Tag introuvable");
  }

export async function updateTag(tagId, newData) {
    const ref = doc(db, "tag", tagId);
    await updateDoc(ref, newData);
}

export async function deleteTag(tagId) {
    const ref = doc(db, "tag", tagId);
    await deleteDoc(ref);
  }

export async function ajouterTagAPublication(publicationId, tagId) {
    const pubRef = doc(db, "Publications", publicationId);
    const snap = await getDoc(pubRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const tags = data.tags || [];

    await updateDoc(pubRef, {
        tags: [...tags, doc(db, "tag", tagId)]
    });
}

export async function getPublicationsByTag(tagId) {
    const pubsRef = collection(db, "Publications");
    const snapshot = await getDocs(pubsRef);
  
    return snapshot.docs
      .filter(doc => {
        const tags = doc.data().tags || [];
        return tags.some(tagRef => tagRef.id === tagId);
      })
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }

export async function tagExiste(tagId) {
  const ref = doc(db, "tag", tagId);
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function retirerTagDePublication(publicationId, tagId) {
  const pubRef = doc(db, "Publications", publicationId);
  const snap = await getDoc(pubRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const tags = data.tags || [];

  const updatedTags = tags.filter(ref => ref.id !== tagId);

  await updateDoc(pubRef, { tags: updatedTags });
}



  
  

  
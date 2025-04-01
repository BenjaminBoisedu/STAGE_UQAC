import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../config/Firebase';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';

// Obtenir tous les documents d'une collection
export const getCollection = async (collectionName) => {
    if (!collectionName) {
        throw new Error("Le nom de la collection ne peut pas être vide");
    }
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération de la collection:", error);
        throw error;
    }
};

// Obtenir un document spécifique par son ID
export const getDocumentById = async (collectionName, id) => {
    if (!collectionName || !id) {
        throw new Error("Le nom de la collection et l'ID ne peuvent pas être vides");
    }
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Document non trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du document:", error);
        throw error;
    }
};

// Ajouter un document à une collection
export const addDocument = async (collectionName, data) => {
    if (!collectionName || !data) {
        throw new Error("Le nom de la collection et les données ne peuvent pas être vides");
    }
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("Erreur lors de l'ajout du document:", error);
        throw error;
    }
};

// Mettre à jour un document existant
export const updateDocument = async (collectionName, id, data) => {
    if (!collectionName || !id || !data) {
        throw new Error("Le nom de la collection, l'ID et les données ne peuvent pas être vides");
    }
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
        return { id, ...data };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du document:", error);
        throw error;
    }
};

// Supprimer un document
export const deleteDocument = async (collectionName, id) => {
    if (!collectionName || !id) {
        throw new Error("Le nom de la collection et l'ID ne peuvent pas être vides");
    }
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        return id;
    } catch (error) {
        console.error("Erreur lors de la suppression du document:", error);
        throw error;
    }
};


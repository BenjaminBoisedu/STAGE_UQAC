
import { db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";


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

export const getDocumentAuthor = async (collectionName, id) => {
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
}


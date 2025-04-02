import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../config/Firebase'
import { getAuth } from 'firebase/auth';


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

export const Login = async (email, password) => {
    const auth = getAuth();
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        throw error;
    }
}

export const Register = async (email, password) => {
    const auth = getAuth();
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        throw error;
    }
}

const auth = getAuth();
export const Logout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        throw error;
    }
}






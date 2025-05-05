import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext);
}

// Provider du contexte d'authentification
export function AuthProvider({ children }) {
  // États
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Observer les changements d'état d'authentification
  useEffect(() => {
    setLoading(true); // Commencer le chargement

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          await fetchUserData(user.uid);
        } catch (err) {
          console.error("Erreur récupération données:", err);
        }
      } else {
        setUserData(null);
      }

      setLoading(false); // Terminer le chargement une fois tout traité
    });

    return () => unsubscribe();
  }, []);

  // Récupérer les données utilisateur
  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "utilisateurs", userId));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        return data;
      } else {
        setError("Profil utilisateur non trouvé");
        return null;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
      setError("Erreur lors du chargement du profil");
      throw err;
    }
  };

  // Inscription
  const register = async (email, password, userData) => {
    try {
      setError("");
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, "utilisateurs", userCredential.user.uid), {
        ...userData,
        email: email,
        dateCreation: new Date(),
        role: "utilisateur",
        publications: [],
      });

      // Mettre à jour l'état
      await fetchUserData(userCredential.user.uid);

      return userCredential.user;
    } catch (error) {
      console.error("Erreur d'inscription:", error);

      // Traduction des messages d'erreur
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Cette adresse e-mail est déjà utilisée");
          break;
        case "auth/invalid-email":
          setError("Adresse e-mail invalide");
          break;
        case "auth/operation-not-allowed":
          setError("L'inscription est désactivée");
          break;
        case "auth/weak-password":
          setError("Le mot de passe est trop faible");
          break;
        default:
          setError("Erreur lors de l'inscription");
      }

      throw error;
    }
  };

  // Connexion avec email et mot de passe
  const login = async (email, password) => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Récupérer les données utilisateur
      await fetchUserData(userCredential.user.uid);

      return userCredential.user;
    } catch (error) {
      console.error("Erreur de connexion:", error);

      // Traduction des messages d'erreur
      switch (error.code) {
        case "auth/invalid-email":
          setError("Adresse e-mail invalide");
          break;
        case "auth/user-disabled":
          setError("Ce compte a été désactivé");
          break;
        case "auth/user-not-found":
          setError("Aucun compte ne correspond à cette adresse e-mail");
          break;
        case "auth/wrong-password":
          setError("Mot de passe incorrect");
          break;
        default:
          setError("Erreur de connexion");
      }

      throw error;
    }
  };

  // Connexion avec Google
  const loginWithGoogle = async () => {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDoc = await getDoc(doc(db, "utilisateurs", result.user.uid));

      if (!userDoc.exists()) {
        // C'est la première connexion, créer un profil utilisateur
        await setDoc(doc(db, "utilisateurs", result.user.uid), {
          nom: result.user.displayName || "Utilisateur Google",
          email: result.user.email,
          dateCreation: new Date(),
          role: "utilisateur",
          avatarURL: result.user.photoURL || "",
          publications: [],
        });
      }

      // Récupérer les données utilisateur
      await fetchUserData(result.user.uid);

      return result.user;
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      setError("Erreur lors de la connexion avec Google");
      throw error;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      setError("");
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      setError("Erreur lors de la déconnexion");
      throw error;
    }
  };

  // Supprimer le compte utilisateur
  const deleteAccount = async (password) => {
    try {
      setError("");

      if (!currentUser) {
        setError("Aucun utilisateur connecté");
        throw new Error("Aucun utilisateur connecté");
      }

      // Réauthentifier l'utilisateur avant de supprimer le compte
      // (nécessaire pour les opérations sensibles)
      if (password) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          password
        );
        await reauthenticateWithCredential(currentUser, credential);
      }

      // Supprimer les données utilisateur dans Firestore
      await deleteDoc(doc(db, "utilisateurs", currentUser.uid));

      // Supprimer le compte dans Firebase Auth
      await deleteUser(currentUser);

      // Réinitialiser les états locaux
      setCurrentUser(null);
      setUserData(null);

      return true;
    } catch (error) {
      console.error("Erreur de suppression du compte:", error);

      switch (error.code) {
        case "auth/requires-recent-login":
          setError("Veuillez vous reconnecter pour effectuer cette opération");
          break;
        case "auth/wrong-password":
          setError("Mot de passe incorrect");
          break;
        default:
          setError("Erreur lors de la suppression du compte");
      }

      throw error;
    }
  };

  // Valeurs exposées par le contexte
  const value = {
    currentUser,
    userData,
    userId: currentUser ? currentUser.uid : null,
    isAuthenticated: !!currentUser,
    error,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    fetchUserData,
    deleteAccount, // Ajout de la nouvelle fonction
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Chargement...</div>}
    </AuthContext.Provider>
  );
}

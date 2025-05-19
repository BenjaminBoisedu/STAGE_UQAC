import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css";
import UserInfos from "../../Components/userComponents/UserInfos";
import DropDownMenu from "../../Components/userComponents/DropDownMenu";
import UserPublications from "../../Components/userComponents/UserPublications";
import { Link } from "react-router-dom";

export default function Profile() {
  const { userData, loading } = useAuth();

  if (loading) return <div>Chargement du profil...</div>;

  const isSuperUtilisateur = userData?.role === "superUtilisateur";

  return (
    <div className="profile-container">
      <div className="user-infos">
        <UserInfos userData={userData} />
        <DropDownMenu />

        {isSuperUtilisateur && (
          <div className="superuser-actions">
            <Link to="/tags/ajouter" className="btn-action">+ Ajouter un tag</Link>
            <Link to="/categories/ajouter" className="btn-action">+ Ajouter une catégorie</Link>
          </div>
        )}
      </div>
      <div className="user-publications">
        <h2>Publications</h2>
        <UserPublications />
      </div>
    </div>
  );
}

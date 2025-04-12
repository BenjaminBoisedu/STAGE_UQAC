import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css";
import UserInfos from "../../Components/userComponents/UserInfos";
import DropDownMenu from "../../Components/userComponents/DropDownMenu";
import UserPublications from "../../Components/userComponents/UserPublications";

export default function Profile() {
  const { userData, loading } = useAuth();

  if (loading) return <div>Chargement du profil...</div>;

  return (
    <div className="profile-container">
      <div className="user-infos">
        <UserInfos userData={userData} />
        <DropDownMenu />
      </div>
      <div className="user-publications">
        <h2>Publications</h2>
        <UserPublications />
      </div>
    </div>
  );
}

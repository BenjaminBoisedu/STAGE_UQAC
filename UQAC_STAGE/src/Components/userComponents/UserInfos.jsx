import React from "react";
import "./UserInfos.css"; // Assurez-vous d'importer le fichier CSS pour le style
import { MdAccountCircle } from "react-icons/md";

export default function UserInfos({ userData }) {
  return (
    <div className="user-info">
      {userData ? (
        <div>
          <div className="avatar">
            {/* Icon User */}
            <MdAccountCircle className="user-icon" size={100} />
          </div>
          <h1>{userData.nom}</h1>
        </div>
      ) : (
        <p>Aucune donnée utilisateur disponible</p>
      )}
    </div>
  );
}

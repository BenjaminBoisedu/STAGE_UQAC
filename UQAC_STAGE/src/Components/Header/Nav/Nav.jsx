import React from "react";
import "./Nav.css";

// Importing icons from react-icons
import { FaHome } from "react-icons/fa";
import { GrArticle } from "react-icons/gr";
import { FaVideo } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";
import { MdAccountBox } from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Nav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">
          <Link to="/">
            <p>Accueil</p>
            <FaHome className="nav__icon" color="#5D5C5C" size={20} />
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/articles">
            <p>Articles</p>
            <GrArticle className="nav__icon" color="#5D5C5CAB" size={20} />
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/Videos">
            <p>Videos</p>
            <FaVideo className="nav__icon" color="#5D5C5CAB" size={20} />
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/Applications">
            <p>Applications</p>
            <DiAndroid className="nav__icon" color="#5D5C5CAB" size={20} />
          </Link>
        </li>
        {isAuthenticated && (
          <li className="nav__item">
            <Link to="/profile">
              <p>Profil</p>
              <MdAccountBox className="nav__icon" color="#5D5C5CAB" size={20} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

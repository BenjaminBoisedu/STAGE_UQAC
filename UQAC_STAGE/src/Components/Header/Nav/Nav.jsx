import React from "react";
import "./Nav.css";

// Importing icons from react-icons
import { FaHome } from "react-icons/fa";
import { GrArticle } from "react-icons/gr";
import { FaVideo } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";
import { MdAccountBox } from "react-icons/md";

export default function Nav() {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">
          <a href="/">
            <p>Accueil</p>
            <FaHome className="nav__icon" color="#5D5C5C" size={20} />
          </a>
        </li>
        <li className="nav__item">
          <a href="/articles">
            <p>Articles</p>
            <GrArticle className="nav__icon" color="#5D5C5CAB" size={20} />
          </a>
        </li>
        <li className="nav__item">
          <a href="/Videos">
            <p>Videos</p>
            <FaVideo className="nav__icon" color="#5D5C5CAB" size={20} />
          </a>
        </li>
        <li className="nav__item">
          <a href="/Applications">
            <p>Applications</p>
            <DiAndroid className="nav__icon" color="#5D5C5CAB" size={20} />
          </a>
        </li>
        <li className="nav__item">
          <a href="/Profile">
            <p>Profil</p>
            <MdAccountBox className="nav__icon" color="#5D5C5CAB" size={20} />
          </a>
        </li>
      </ul>
    </nav>
  );
}

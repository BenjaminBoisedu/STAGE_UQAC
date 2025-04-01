import React from "react";
import "./Header.css";
import Nav from "./Nav/Nav";

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <Nav />
      </nav>
    </header>
  );
}

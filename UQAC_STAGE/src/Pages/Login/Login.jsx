import React from "react";
import "./Login.css";
import Login_Form from "../../Components/Form/Login/Login_Form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="title">
        <h1>Connexion</h1>
      </div>
      <Login_Form />
    </div>
  );
}

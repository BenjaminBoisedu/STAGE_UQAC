import React from "react";
import "./Signup.css";
import Signup_Form from "../../Components/Form/Register/Register_Form.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Signup() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);
  return (
    <div className="signup-container">
      <div className="signup-content">
        <Signup_Form />
      </div>
    </div>
  );
}

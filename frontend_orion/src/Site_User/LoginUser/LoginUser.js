import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../StyleCss/Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [passwordUtilisateur, setPasswordUtilisateur] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/utilisateurslogin", {
        nomUtilisateur,
        passwordUtilisateur,
      });

      // ✅ Sauvegarde des infos utilisateur dans le localStorage
      localStorage.setItem("userData", JSON.stringify(res.data.utilisateur));

      Swal.fire("Succès", "Connexion réussie", "success");
      navigate("/user/dashboard");
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Une erreur est survenue",
        "error"
      );
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="logo-box">
          <img
            src="/images/logo/logo_orion.jpg"
            alt="Logo"
            height="70"
            style={{ borderRadius: "40%" }}
          />
        </div>

        <h1 className="login-title">Connexion Utilisateur</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom utilisateur"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={passwordUtilisateur}
            onChange={(e) => setPasswordUtilisateur(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="btn">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../StyleCss/Presence.css";

function Presence() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isArrivee, setIsArrivee] = useState(
    JSON.parse(localStorage.getItem("isArrivee")) ?? true
  );

  const employeId =
    userData?.id_employe || userData?.id || userData?.employe_id;

  // ✅ Vérifie la date du jour et restaure l’état du bouton
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem("presenceDate");

    if (savedDate !== today) {
      localStorage.removeItem("isArrivee");
      localStorage.setItem("presenceDate", today);
      setIsArrivee(true);
    }
  }, []);

  const handleArrivee = async () => {
    if (!employeId) {
      Swal.fire("Erreur", "Identifiant employé introuvable.", "error");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/presence/arrivee", {
        employe_id: employeId,
      });
      Swal.fire("✅", "Arrivée enregistrée avec succès !", "success");
      setIsArrivee(false);
      localStorage.setItem("isArrivee", false);
    } catch (err) {
      Swal.fire("⚠️", err.response?.data?.message || "Erreur serveur", "warning");
    }
  };

  const handleDepart = async () => {
    if (!employeId) {
      Swal.fire("Erreur", "Identifiant employé introuvable.", "error");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/presence/depart", {
        employe_id: employeId,
      });
      Swal.fire("👋", "Départ enregistré avec succès !", "success");
      setIsArrivee(true);
      localStorage.setItem("isArrivee", true);
    } catch (err) {
      Swal.fire("⚠️", err.response?.data?.message || "Erreur serveur", "warning");
    }
  };

  return (
    <div className="presence-container">
      <h2>Suivi de Présence</h2>
      <button
        onClick={isArrivee ? handleArrivee : handleDepart}
        className="btn-presence"
      >
        {isArrivee ? "Enregistrer Arrivée" : "Enregistrer Départ"}
      </button>
    </div>
  );
}

export default Presence;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import "../../StyleCss/Presence.css";

function Presence() {

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [filteredHistorique, setFilteredHistorique] = useState([]);


  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const employeId = userData?.id;

  const [isArrivee, setIsArrivee] = useState(
    JSON.parse(sessionStorage.getItem("isArrivee")) ?? true
  );
  const [historique, setHistorique] = useState([]);

  // 🔄 Charger l’historique
  const fetchHistorique = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/presence/historique/${employeId}`
      );
      setHistorique(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement de l’historique :", err);
    }
  };

  // Charger l’historique à l’ouverture du composant
  useEffect(() => {
    if (employeId) fetchHistorique();
  }, [employeId]);

  // Gestion bouton arrivée / départ
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
      sessionStorage.setItem("isArrivee", false);
      fetchHistorique(); // 🔄 mise à jour automatique
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
      sessionStorage.setItem("isArrivee", true);
      fetchHistorique(); // 🔄 mise à jour automatique
    } catch (err) {
      Swal.fire("⚠️", err.response?.data?.message || "Erreur serveur", "warning");
    }
  };

  // ✅ Colonnes du tableau
  const columns = [
    {
      name: "Date",
      selector: (row) => new Date(row.date_presence).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Période",
      selector: (row) =>
        row.heure_arrivee && row.heure_arrivee < "12:00" ? "Matin" : "Après-midi",
      sortable: true,
    },
    {
      name: "Heure d'arrivée",
      selector: (row) => row.heure_arrivee || "--:--",
    },
    {
      name: "Statut",
      selector: (row) => row.statut_presence,
    },
    {
      name: "Heure de départ",
      selector: (row) => row.heure_depart || "--:--",
    },
  ];

  const filterByDate = () => {
  if (!dateDebut || !dateFin) {
    Swal.fire("Erreur", "Veuillez sélectionner les deux dates.", "warning");
    return;
  }

  const filtered = historique.filter((item) => {
    const itemDate = new Date(item.date_presence);
    return itemDate >= new Date(dateDebut) && itemDate <= new Date(dateFin);
  });

  setFilteredHistorique(filtered);
};

const resetFilter = () => {
  setFilteredHistorique(historique);
  setDateDebut("");
  setDateFin("");
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

      {/* ✅ DataTable pour afficher l’historique */}
      <h3>Historique des présences</h3>
      <div className="date-filter">
  <label>Du : </label>
  <input
    type="date"
    value={dateDebut}
    onChange={(e) => setDateDebut(e.target.value)}
  />
  <label>Au : </label>
  <input
    type="date"
    value={dateFin}
    onChange={(e) => setDateFin(e.target.value)}
  />
  <button onClick={filterByDate}>Filtrer</button>
  <button onClick={resetFilter}>Réinitialiser</button>
</div>

      <div className="datatable-container">
    
     <DataTable
      columns={columns}
      data={filteredHistorique.length ? filteredHistorique : historique}
      pagination
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 10, 15]}
      highlightOnHover
      striped
      responsive
      noDataComponent="Aucun enregistrement trouvé."
    />


      </div>
    </div>
  );
}

export default Presence;

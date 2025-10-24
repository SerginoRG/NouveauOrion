import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../StyleCss/BulletinSalaire.css";

function BulletinSalaire() {
  const [bulletins, setBulletins] = useState([]);
  const [salaireList, setSalaireList] = useState([]);
  const [formData, setFormData] = useState({
    reference_bulletin: "",
    date_generation: "",
    salaire_id: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBulletins();
    fetchSalaires();
  }, []);

  const fetchBulletins = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/bulletins");
    setBulletins(res.data);
  };

  const fetchSalaires = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/salaires");
    setSalaireList(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/bulletins", formData);
      Swal.fire("✅ Succès", "Bulletin de salaire créé avec succès", "success");
      fetchBulletins();
      setFormData({ reference_bulletin: "", date_generation: "", salaire_id: "" });
      setShowModal(false);
    } catch (error) {
      Swal.fire("❌ Erreur", error.response?.data?.message || "Échec de création", "error");
    }
  };

  const generatePDF = async (id) => {
    try {
      await axios.get(`http://127.0.0.1:8000/api/bulletins/${id}/generate-pdf`);
      Swal.fire("📄 Succès", "Bulletin PDF généré avec succès", "success");
      fetchBulletins();
    } catch {
      Swal.fire("⚠️ Erreur", "Impossible de générer le PDF", "error");
    }
  };

  return (
    <div className="bulletin-container">
      <div className="header-section">
        <h2>Gestion des Bulletins de Salaire</h2>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          Nouveau Bulletin
        </button>
      </div>

      {/* Tableau */}
      <table className="bulletin-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Date</th>
            <th>Employé</th>
            <th>Salaire Net</th>
            <th>Fichier PDF</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bulletins.map((b) => (
            <tr key={b.id_bulletin}>
              <td>{b.reference_bulletin}</td>
              <td>{b.date_generation}</td>
              <td>{b.salaire?.employe?.nom_employe}</td>
              <td>{b.salaire?.salaire_net?.toLocaleString()} Ar</td>
              <td>
                {b.fichier_pdf ? (
                  <a
                    href={`http://127.0.0.1:8000/storage/${b.fichier_pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="pdf-link"
                  >
                    Voir PDF
                  </a>
                ) : (
                  <span className="no-file">Aucun</span>
                )}
              </td>
              <td>
                <button className="btn-generate" onClick={() => generatePDF(b.id_bulletin)}>
                  Générer PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modale Formulaire */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Créer un Bulletin de Salaire</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>Référence Bulletin</label>
              <input
                type="text"
                name="reference_bulletin"
                value={formData.reference_bulletin}
                onChange={handleChange}
                required
              />

              <label>Date de génération</label>
              <input
                type="date"
                name="date_generation"
                value={formData.date_generation}
                onChange={handleChange}
                required
              />

              <label>Salaire associé</label>
              <select
                name="salaire_id"
                value={formData.salaire_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner --</option>
                {salaireList.map((s) => (
                  <option key={s.id_salaire} value={s.id_salaire}>
                    {s.employe.nom_employe} {s.employe.prenom_employe} —{" "}
                    {s.mois_salaire} {s.annee_salaire}
                  </option>
                ))}
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulletinSalaire;

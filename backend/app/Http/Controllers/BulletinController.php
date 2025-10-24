<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bulletin;
use App\Models\Salaire;
use Illuminate\Support\Facades\Storage;
use PDF;

class BulletinController extends Controller
{
    // 🔹 Lister tous les bulletins
    public function index()
    {
        $bulletins = Bulletin::with('salaire.employe')->get();
        return response()->json($bulletins);
    }

    // 🔹 Créer un bulletin
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference_bulletin' => 'required|string|unique:bulletins,reference_bulletin',
            'date_generation' => 'required|date',
            'salaire_id' => 'required|exists:salaires,id_salaire',
        ]);

        $bulletin = Bulletin::create($validated);

        return response()->json([
            'message' => 'Bulletin de salaire créé avec succès',
            'data' => $bulletin
        ], 201);
    }

    // 🔹 Mettre à jour (ajouter ou remplacer le PDF)
    public function update(Request $request, $id)
    {
        $bulletin = Bulletin::findOrFail($id);

        $validated = $request->validate([
            'fichier_pdf' => 'nullable|file|mimes:pdf|max:4096',
        ]);

        if ($request->hasFile('fichier_pdf')) {
            if ($bulletin->fichier_pdf) {
                Storage::disk('public')->delete($bulletin->fichier_pdf);
            }

            $path = $request->file('fichier_pdf')->store('bulletins', 'public');
            $bulletin->update(['fichier_pdf' => $path]);
        }

        return response()->json([
            'message' => 'Bulletin mis à jour avec succès',
            'data' => $bulletin
        ]);
    }

    // 🔹 Générer un PDF automatique
    public function genererPDF($id)
    {
        $bulletin = Bulletin::with('salaire.employe')->findOrFail($id);
        $salaire = $bulletin->salaire;
        $employe = $salaire->employe;

        $pdf = \PDF::loadView('pdf.bulletin', compact('bulletin', 'salaire', 'employe'));
        $path = 'bulletins/bulletin_' . $bulletin->reference_bulletin . '.pdf';
        Storage::disk('public')->put($path, $pdf->output());

        $bulletin->update(['fichier_pdf' => $path]);

        return response()->json([
            'message' => 'Bulletin PDF généré avec succès',
            'fichier_pdf' => $path
        ]);
    }

    // 🔹 Supprimer un bulletin
    public function destroy($id)
    {
        $bulletin = Bulletin::findOrFail($id);
        if ($bulletin->fichier_pdf) {
            Storage::disk('public')->delete($bulletin->fichier_pdf);
        }
        $bulletin->delete();
        return response()->json(['message' => 'Bulletin supprimé avec succès']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PresenceController extends Controller
{
    // Enregistrement de l'arrivée
    public function arrivee(Request $request)
    {
   $request->validate([
        'employe_id' => 'required|exists:employes,id_employe',
    ]);


        $now = Carbon::now();
        $date = $now->toDateString();
        $heure = $now->format('H:i');

        // Déterminer la période
        $periode = $now->hour < 12 ? 'matin' : 'apresmidi';

        // Déterminer le statut
        if ($periode === 'matin') {
            if ($heure >= '07:00' && $heure <= '08:15') {
                $statut = 'Présent';
            } elseif ($heure >= '08:16' && $heure <= '10:00') {
                $statut = 'En retard';
            } else {
                $statut = 'Absent';
            }
        } else {
            if ($heure >= '14:00' && $heure <= '15:15') {
                $statut = 'Présent';
            } elseif ($heure >= '15:16' && $heure <= '17:00') {
                $statut = 'En retard';
            } else {
                $statut = 'Absent';
            }
        }

        // Vérifie si une présence existe déjà pour aujourd’hui et cette période
        $presence = Presence::where('employe_id', $request->employe_id)
            ->whereDate('date_presence', $date)
            ->first();

        if ($presence && $presence->heure_depart === null) {
            return response()->json([
                'message' => 'Vous avez déjà enregistré votre arrivée pour cette période.',
            ], 409);
        }

        $presence = Presence::create([
            'date_presence' => $date,
            'heure_arrivee' => $heure,
            'statut_presence' => $statut,
            'employe_id' => $request->employe_id,
        ]);

        return response()->json([
            'message' => 'Arrivée enregistrée avec succès.',
            'data' => $presence
        ], 201);
    }

    // Enregistrement du départ
    public function depart(Request $request)
    {
$request->validate([
        'employe_id' => 'required|exists:employes,id_employe',
    ]);


        $now = Carbon::now();
        $date = $now->toDateString();
        $heure = $now->format('H:i');

        // Récupère la dernière présence du jour
        $presence = Presence::where('employe_id', $request->employe_id)
            ->whereDate('date_presence', $date)
            ->latest('id_presence')
            ->first();

        if (!$presence) {
            return response()->json(['message' => 'Aucune arrivée trouvée.'], 404);
        }

        $presence->update(['heure_depart' => $heure]);

        return response()->json([
            'message' => 'Départ enregistré avec succès.',
            'data' => $presence
        ], 200);
    }

    // Historique des présences de l’employé connecté
    public function historique($employe_id)
    {
        $presences = Presence::where('employe_id', $employe_id)
            ->orderBy('date_presence', 'desc')
            ->get();

        return response()->json($presences);
    }

    // app/Http/Controllers/PresenceController.php

  // Afficher toutes les présences (pour l'admin)
    public function index()
    {
        $presences = Presence::with('employe')
            ->orderBy('date_presence', 'desc')
            ->get();

        return response()->json($presences);
    }



}

<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index()
    {
        return Utilisateur::with('employe')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_utilisateur' => 'required|unique:utilisateurs,nom_utilisateur',
            'password_utilisateur' => 'required|min:6',
            'employe_id' => 'required|exists:employes,id_employe',
        ]);

        $validated['password_utilisateur'] = Hash::make($validated['password_utilisateur']);
        $validated['statut_utilisateur'] = true;

        $utilisateur = Utilisateur::create($validated);
        return response()->json($utilisateur, 201);
    }

    public function show($id)
    {
        return Utilisateur::with('employe')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);

        $data = $request->validate([
            'nom_utilisateur' => 'required',
            'password_utilisateur' => 'nullable|min:6',
            'employe_id' => 'required|exists:employes,id_employe',
        ]);

        if (!empty($data['password_utilisateur'])) {
            $data['password_utilisateur'] = Hash::make($data['password_utilisateur']);
        } else {
            unset($data['password_utilisateur']);
        }

        $utilisateur->update($data);
        return response()->json($utilisateur);
    }

    public function updateStatut(Request $request, $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->statut_utilisateur = $request->statut_utilisateur;
        $utilisateur->save();

        return response()->json(['message' => 'Statut mis à jour avec succès']);
    }

    public function destroy($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
     // LOGIN UTILISATEUR
    public function login(Request $request)
    {
        $request->validate([
            'nomUtilisateur' => 'required|string',
            'passwordUtilisateur' => 'required|string',
        ]);

        $user = Utilisateur::where('nom_utilisateur', $request->nomUtilisateur)
            ->with('employe')
            ->first();

        if (!$user || !Hash::check($request->passwordUtilisateur, $user->password_utilisateur)) {
            return response()->json(['message' => 'Nom d’utilisateur ou mot de passe incorrect'], 401);
        }

        // Si OK, on retourne les infos (photo + email)
        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => [
                'id' => $user->id_utilisateur,
                'nom_utilisateur' => $user->nom_utilisateur,
                'email' => $user->employe->email_employe ?? null,
                'photo' => $user->employe->photo_profil_employe 
                    ? asset('storage/' . $user->employe->photo_profil_employe)
                    : null,
            ]
        ], 200);
    }

    

    public function profil($id)
        {
            $user = \App\Models\Utilisateur::with(['employe.service'])
                ->find($id);

            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            return response()->json([
                'id_utilisateur' => $user->id_utilisateur,
                'nom_utilisateur' => $user->nom_utilisateur,
                'email' => $user->employe->email_employe ?? null,
                'photo' => $user->employe->photo_profil_employe
                    ? asset('storage/' . $user->employe->photo_profil_employe)
                    : null,
                'employe' => [
                    'matricule' => $user->employe->matricule_employe,
                    'nom' => $user->employe->nom_employe,
                    'prenom' => $user->employe->prenom_employe,
                    'poste' => $user->employe->poste_employe,
                    'date_embauche' => $user->employe->date_embauche_employe,
                    'salaire_base' => $user->employe->salaire_base_employe,
                    'service' => $user->employe->service->nom_service ?? 'Non défini',
                ]
            ]);
        }

}

<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\ContratController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\PresenceController;

// API pour Admin
Route::post('/login', [AdminController::class, 'login']);

// CRUD API pour Service
Route::get('/services', [ServiceController::class, 'index']);       // Lire
Route::post('/services', [ServiceController::class, 'store']);       // Créer
Route::get('/services/{id}', [ServiceController::class, 'show']);    // Lire 1 service
Route::put('/services/{id}', [ServiceController::class, 'update']);  // Modifier
Route::delete('/services/{id}', [ServiceController::class, 'destroy']); // Supprimer

// CRUD Employé
Route::get('/employes/{service_id}', [EmployeController::class, 'index']);   // Lister par service
Route::get('/employe/{id}', [EmployeController::class, 'show']);             // Afficher un employé
Route::post('/employes', [EmployeController::class, 'store']);               // Créer
Route::put('/employes/{id}', [EmployeController::class, 'update']);          // Modifier
Route::delete('/employes/{id}', [EmployeController::class, 'destroy']);      // Supprimer

// CRUD Contrat
Route::get('/contrats', [ContratController::class, 'index']);
Route::get('/contrats/{id}', [ContratController::class, 'show']);
Route::post('/contrats', [ContratController::class, 'store']);
Route::put('/contrats/{id}', [ContratController::class, 'update']);
Route::delete('/contrats/{id}', [ContratController::class, 'destroy']);

// Liste tous les employés (pour le select)
Route::get('/employes', [EmployeController::class, 'all']);
// Contrat par employé
Route::get('/contrats/employe/{employe_id}', [ContratController::class, 'getByEmploye']);


Route::get('/utilisateurs', [UtilisateurController::class, 'index']);
Route::post('/utilisateurs', [UtilisateurController::class, 'store']);
Route::get('/utilisateurs/{id}', [UtilisateurController::class, 'show']);
Route::put('/utilisateurs/{id}', [UtilisateurController::class, 'update']);
Route::delete('/utilisateurs/{id}', [UtilisateurController::class, 'destroy']);

// route spéciale pour changer le statut via le tableau
Route::put('/utilisateurs/{id}/statut', [UtilisateurController::class, 'updateStatut']);

Route::post('/utilisateurslogin', [UtilisateurController::class, 'login']);

Route::get('/utilisateurs/{id}/profil', [UtilisateurController::class, 'profil']);


Route::post('/presence/arrivee', [PresenceController::class, 'arrivee']);
Route::post('/presence/depart', [PresenceController::class, 'depart']);
Route::get('/presence/historique/{employe_id}', [PresenceController::class, 'historique']);



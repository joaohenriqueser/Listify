<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController; 
use App\Http\Controllers\WeatherController; 
use App\Models\Task; 
use Illuminate\Support\Facades\Auth; 
use Illuminate\Http\Request; // Importar Request para os filtros
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rotas Web
|--------------------------------------------------------------------------
|
| Estas rotas são carregadas pelo seu RouteServiceProvider e são 
| a base de navegação do seu aplicativo Inertia (React).
|
*/

// Rota de Boas-vindas (Padrão do instalador)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home'); // Nomeado como 'home' para evitar erros de link no frontend

// --- ROTA DASHBOARD (REQUISITO 2 - LISTAGEM E FILTROS) ---
Route::get('/dashboard', function (Request $request) {
    
    // 1. Inicia a query de tarefas SÓ DO USUÁRIO LOGADO
    $query = Auth::user()->tasks();

    // 2. Lógica de FILTROS
    if ($request->filled('status') && $request->status !== 'all') {
        $query->where('status', $request->status);
    }
    
    if ($request->filled('deadline')) {
         // Filtra pela data exata
         $query->whereDate('deadline', $request->deadline); 
    }

    // 3. Busca os dados ordenados
    $tasks = $query->orderBy('deadline', 'asc')->get();

    // 4. Renderiza o componente React 'Dashboard' e envia os dados
    return Inertia::render('Dashboard', [
        'tasks' => $tasks,
        'filters' => $request->only(['status', 'deadline']), // Envia os filtros de volta para manter o estado do React
    ]);
})->middleware(['auth', 'verified'])->name('dashboard'); // Protegido por login

// ROTAS PROTEGIDAS (CRUD, CLIMA e PERFIL)
Route::middleware('auth')->group(function () {
    
    // Rotas de Perfil (Padrão do instalador)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- ROTAS DO CRUD DE TAREFAS (REQUISITO 2) ---
    // tasks.store, tasks.update, tasks.destroy
    Route::resource('tasks', TaskController::class)->only(['store', 'update', 'destroy']);

    // --- ROTA DA API DE CLIMA (REQUISITO 3) ---
    Route::post('/weather', [WeatherController::class, 'getWeather'])->name('weather.get');
});

// Inclui as rotas de autenticação (Login, Registro, Logout, etc.) que estão em auth.php
require __DIR__.'/auth.php';
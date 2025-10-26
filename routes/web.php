<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController; // <-- ADICIONE
use App\Models\Task; // <-- ADICIONE
use Illuminate\Support\Facades\Auth; // <-- ADICIONE
use Illuminate\Http\Request; // <-- ADICIONE
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rotas Web
|--------------------------------------------------------------------------
*/

// Rota de Boas-vindas (Padrão do Breeze)
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::middleware('guest')->group(function () {
    // Rota para MOSTRAR a página de login
    Route::get('login', function () {
        return Inertia::render('auth/login'); // Carrega o seu arquivo login.tsx
    })->name('login');

    // Rota para MOSTRAR a página de registro
    Route::get('register', function () {
        return Inertia::render('auth/register'); // Carrega o seu arquivo register.tsx
    })->name('register');
});

// ROTA DO DASHBOARD (AQUI CARREGAMOS OS DADOS)
Route::get('/dashboard', function (Request $request) {
    // 1. Começa a query de tarefas SÓ DO USUÁRIO LOGADO
    $query = Auth::user()->tasks();

    // 2. Lógica de FILTROS (Requisito 2)
    // Filtro por Status (ex: /dashboard?status=pending)
    if ($request->filled('status')) { // filled() ignora 'all' ou vazio
        $query->where('status', $request->status);
    }
    
    // Filtro por Prazo (ex: /dashboard?deadline=2025-10-30)
    if ($request->filled('deadline')) {
         $query->whereDate('deadline', $request->deadline);
    }

    // 3. Busca os dados
    $tasks = $query->orderBy('deadline', 'asc')->get();

    return Inertia::render('dashboard', [
        'tasks' => $tasks,
        'filters' => $request->only(['status', 'deadline']), // Envia os filtros de volta
    ]);
})->middleware(['auth', 'verified'])->name('dashboard'); // Protegido por login

// ROTAS DE PERFIL E CRUD (PROTEGIDAS)
Route::middleware('auth')->group(function () {
    // Rotas de Perfil (Padrão do Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/weather', [WeatherController::class, 'getWeather'])->name('weather.get');

    // --- ROTAS DO CRUD DE TAREFAS ---
    // Cria as rotas:
    // POST /tasks -> TaskController@store (tasks.store)
    // PUT /tasks/{task} -> TaskController@update (tasks.update)
    // DELETE /tasks/{task} -> TaskController@destroy (tasks.destroy)
    Route::resource('tasks', TaskController::class)->only(['store', 'update', 'destroy']);
});
<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\TaskController; 
use App\Http\Controllers\WeatherController; 
use App\Models\Task; 
use Illuminate\Support\Facades\Auth; 
use Illuminate\Http\Request; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home'); 

// --- ROTA DASHBOARD 
Route::get('/dashboard', function (Request $request) {
    
    $query = Auth::user()->tasks();

    if ($request->filled('status') && $request->status !== 'all') {
        $query->where('status', $request->status);
    }
    
    if ($request->filled('deadline')) {
         $query->whereDate('deadline', $request->deadline); 
    }

    $tasks = $query->orderBy('deadline', 'asc')->get();

    return Inertia::render('dashboard', [
        'tasks' => $tasks,
        'filters' => $request->only(['status', 'deadline']), 
    ]);
})->middleware(['auth', 'verified'])->name('dashboard'); 

Route::middleware('auth')->group(function () {
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('tasks', TaskController::class)->only(['store', 'update', 'destroy'])->names('tasks'); 

    Route::post('/weather', [WeatherController::class, 'getWeather'])->name('weather.get');
});
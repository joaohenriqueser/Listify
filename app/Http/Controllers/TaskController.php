<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse; 
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $statusFilter = $request->query('status');

        $filterByDate = $request->query('filter_date', '0'); 

        $query = Auth::user()->tasks();

        if ($statusFilter && $statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        if ($filterByDate === '1') {
            $query->where('completed', false)
                  ->whereDate('deadline', '>=', now()->toDateString());
        }

        $tasks = $query->orderBy('deadline', 'asc')->get();

        return Inertia::render('Dashboard', [
            'tasks' => $tasks,
            'statusFilter' => $statusFilter,
            'filterByDate' => $filterByDate, 
        ]);
    }
    
    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date',
            'status' => ['required', Rule::in(['pending', 'in_progress'])],
        ]);
        Auth::user()->tasks()->create($validatedData);
        return redirect()->route('dashboard'); 
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task); 

        $validatedData = $request->validate([
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'deadline'    => ['sometimes', 'required', 'date'],
            'status'      => ['sometimes', 'required', Rule::in(['pending', 'in_progress', 'completed'])],
        ]);
        $task->update($validatedData);
        return redirect()->route('dashboard');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task); 

        $task->delete();
        return redirect()->route('dashboard');
    }
}

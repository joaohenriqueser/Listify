<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse; 
use Illuminate\Validation\Rule; // Importante para validar o 'status'

class TaskController extends Controller
{
    /**
     * Salva uma nova tarefa no banco de dados.
     * Rota: POST /tasks
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validação (PHP)
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date',
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
        ]);

        // 2. Cria a tarefa associada ao usuário logado
        Auth::user()->tasks()->create($validatedData);

        // 3. Redireciona de volta ao Dashboard
        return redirect()->route('dashboard');
    }

    /**
     * Atualiza uma tarefa existente.
     * Rota: PUT /tasks/{task}
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        // 1. Autorização (Verifica se é o dono via TaskPolicy)
        $this->authorize('update', $task);

        // 2. Validação
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date',
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
        ]);

        // 3. Atualiza
        $task->update($validatedData);

        // 4. Redireciona
        return redirect()->route('dashboard');
    }

    /**
     * Remove uma tarefa do banco de dados.
     * Rota: DELETE /tasks/{task}
     */
    public function destroy(Task $task): RedirectResponse
    {
        // 1. Autorização (Verifica se é o dono via TaskPolicy)
        $this->authorize('delete', $task);

        // 2. Deleta
        $task->delete();

        // 3. Redireciona
        return redirect()->route('dashboard');
    }
}
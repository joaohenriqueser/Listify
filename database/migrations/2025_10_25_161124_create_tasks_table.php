<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            // Chave estrangeira para o usuário
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Campos de Tarefa
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('deadline');
            
            // Status (usaremos o ENUM para garantir apenas esses valores)
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
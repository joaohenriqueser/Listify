<?php
namespace App\Policies;
use App\Models\Task;
use App\Models\User;
class TaskPolicy
{
    private function isOwner(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }
    public function update(User $user, Task $task): bool
    {
        return $this->isOwner($user, $task);
    }
    public function delete(User $user, Task $task): bool
    {
        return $this->isOwner($user, $task);
    }
}
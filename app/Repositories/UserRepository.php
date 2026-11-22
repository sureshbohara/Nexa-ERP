<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new User();
    }

    public function getAll(?int $excludeUserId = null, array $relations = ['role', 'branch', 'organization']): Collection
    {
        $query = $this->model->select(
            'id', 'first_name', 'last_name', 'email', 'username', 'phone', 'gender',
            'image', 'bio', 'status', 'last_login_at', 'role_id', 'branch_id', 'organization_id', 'created_at'
        )->with($relations);

        if ($excludeUserId) {
            $query->where('id', '!=', $excludeUserId);
        }

        return $query->latest()->get();
    }

    public function create(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->model->create($data);
    }

    public function update(Model $model, array $data): User
    {
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        $model->update($data);
        return $model->fresh();
    }
}
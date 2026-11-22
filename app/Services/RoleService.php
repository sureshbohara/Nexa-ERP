<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\RoleRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleService
{
    public function __construct(protected RoleRepository $repository) {}

    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getAllWithPermissions($perPage);
    }

    public function create(array $data): Role
    {
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);

        $role = $this->repository->create($data);

        $role->permissions()->sync($permissions);

        return $role->load('permissions:id,name');
    }

    public function update(Role $role, array $data): Role
    {
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);

        $this->repository->update($role, $data);

        $role->permissions()->sync($permissions);

        return $role->fresh(['permissions:id,name']);
    }

    public function delete(Role $role): bool
    {
        if ($role->is_system) {
            return false;
        }

        if ($role->users()->exists()) {
            return false;
        }

        return $this->repository->delete($role);
    }
}
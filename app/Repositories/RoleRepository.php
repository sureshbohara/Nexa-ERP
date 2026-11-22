<?php

namespace App\Repositories;

use App\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Role();
    }

    public function getAllWithPermissions(int $perPage = 15): LengthAwarePaginator 
    {
        return $this->model
            ->with('permissions:id,name,module')
            ->latest()
            ->paginate($perPage);
    }
}
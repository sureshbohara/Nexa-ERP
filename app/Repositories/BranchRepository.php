<?php

namespace App\Repositories;

use App\Models\Branch;

class BranchRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Branch();
    }

    public function getAllWithOrganization()
    {
        return $this->model
            ->with('organization:id,name')
            ->latest()
            ->get();
    }
}
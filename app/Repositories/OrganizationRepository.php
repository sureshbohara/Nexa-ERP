<?php

namespace App\Repositories;

use App\Models\Organization;

class OrganizationRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Organization();
    }

    public function getAll()
    {
        return $this->model->latest()->get(); 
    }
}
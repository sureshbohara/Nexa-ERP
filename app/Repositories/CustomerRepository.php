<?php

namespace App\Repositories;

use App\Models\Customer;

class CustomerRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Customer();
    }

    public function getAll()
    {
        return $this->model->latest()->get();
    }
}
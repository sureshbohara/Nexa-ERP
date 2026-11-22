<?php

namespace App\Repositories;

use App\Models\PaymentGateway;

class PaymentGatewayRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new PaymentGateway();
    }

    public function getAll()
    {
        return $this->getModel()
            ->orderBy('sort_order')
            ->get();
    }
}

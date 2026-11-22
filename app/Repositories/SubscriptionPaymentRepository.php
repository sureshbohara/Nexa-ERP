<?php

namespace App\Repositories;

use App\Models\SubscriptionPayment;

class SubscriptionPaymentRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new SubscriptionPayment();
    }

    public function getAll()
    {
        return $this->getModel()
            ->with([
                'organization:id,name',
                'gateway:id,name',
                'invoice:id,invoice_no',
            ])
            ->latest('payment_date')
            ->get();
    }
}

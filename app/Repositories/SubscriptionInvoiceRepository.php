<?php

namespace App\Repositories;

use App\Models\SubscriptionInvoice;

class SubscriptionInvoiceRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new SubscriptionInvoice();
    }

    public function getAll()
    {
        return $this->getModel()
            ->with([
                'organization:id,name',
                'subscription:id,plan_name',
            ])
            ->latest('invoice_date')
            ->get();
    }
}

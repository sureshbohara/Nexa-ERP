<?php

namespace App\Services;

use App\Models\SubscriptionInvoice;
use App\Repositories\SubscriptionInvoiceRepository;

class SubscriptionInvoiceService
{
    public function __construct(protected SubscriptionInvoiceRepository $repository){
    }

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): SubscriptionInvoice
    {
        return $this->repository->create($data);
    }

    public function update(SubscriptionInvoice $invoice, array $data): SubscriptionInvoice
    {
        return $this->repository->update($invoice, $data);
    }

    public function delete(SubscriptionInvoice $invoice): bool
    {
        return $this->repository->delete($invoice);
    }
}

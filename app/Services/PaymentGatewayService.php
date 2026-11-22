<?php

namespace App\Services;

use App\Models\PaymentGateway;
use App\Repositories\PaymentGatewayRepository;

class PaymentGatewayService
{
    public function __construct(
        protected PaymentGatewayRepository $repository
    ) {
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function create(array $data): PaymentGateway
    {
        return $this->repository->create($data);
    }

    public function update(
        PaymentGateway $gateway,
        array $data
    ): PaymentGateway {
        return $this->repository->update($gateway, $data);
    }

    public function delete(PaymentGateway $gateway): bool
    {
        return $this->repository->delete($gateway);
    }
}

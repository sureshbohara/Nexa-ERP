<?php

namespace App\Services;

use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use App\Repositories\SaleReturnRepository;
use Illuminate\Support\Facades\DB;

class SaleReturnService
{
    public function __construct(protected SaleReturnRepository $repository) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function create(array $data, $user): SaleReturn
    {
        return DB::transaction(function () use ($data, $user) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $data['user_id'] = $user->id;

            $return = $this->repository->create($data);

            foreach ($items as $item) {
                $item['sale_return_id'] = $return->id;
                SaleReturnItem::create($item);
            }

        

            return $return->load('items.product');
        });
    }

    public function update(SaleReturn $saleReturn, array $data, $user): SaleReturn
    {
        return DB::transaction(function () use ($saleReturn, $data, $user) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $saleReturn->update($data);

            if (!empty($items)) {
                $saleReturn->items()->delete();

                foreach ($items as $item) {
                    $item['sale_return_id'] = $saleReturn->id;
                    SaleReturnItem::create($item);
                }
            }

            return $saleReturn->load('items.product');
        });
    }

    public function delete(SaleReturn $saleReturn): bool
    {
        return $this->repository->delete($saleReturn);
    }

    public function updateStatus(SaleReturn $saleReturn, string $status): SaleReturn
    {
        return $this->repository->update($saleReturn, [
            'status' => $status,
        ]);
    }
}
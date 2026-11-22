<?php

namespace App\Services;

use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Repositories\PurchaseReturnRepository;
use Illuminate\Support\Facades\DB;

class PurchaseReturnService
{
    public function __construct(protected PurchaseReturnRepository $repository) {}

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data, $user): PurchaseReturn
    {
        return DB::transaction(function () use ($data, $user) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $data['user_id'] = $user->id;

            $return = $this->repository->create($data);

            foreach ($items as $item) {
                $item['purchase_return_id'] = $return->id;
                PurchaseReturnItem::create($item);
            }

            return $return->load('items.product');
        });
    }



    public function update(PurchaseReturn $purchaseReturn, array $data, $user): PurchaseReturn
    {
        return DB::transaction(function () use ($purchaseReturn, $data, $user) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $purchaseReturn->update($data);

            if (!empty($items)) {
                $purchaseReturn->items()->delete();

                foreach ($items as $item) {
                    $item['purchase_return_id'] = $purchaseReturn->id;
                    PurchaseReturnItem::create($item);
                }
            }

            return $purchaseReturn->load('items.product');
        });
    }


    public function delete(PurchaseReturn $purchaseReturn): bool
    {
        return $this->repository->delete($purchaseReturn);
    }


    public function updateStatus(PurchaseReturn $purchaseReturn, string $status): PurchaseReturn
    {
        return $this->repository->update($purchaseReturn, [
            'status' => $status,
        ]);
    }

    
}
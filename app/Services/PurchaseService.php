<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchasePayment;
use App\Repositories\PurchaseRepository;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    public function __construct(
        protected PurchaseRepository $repository,
        protected AutoJournalService $autoJournalService
    ) {}

    public function getAll() { return $this->repository->getAll(); }

    public function create(array $data): Purchase
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $purchase = $this->repository->create($data);
            
            foreach ($items as $item) {
                $item['purchase_id'] = $purchase->id;
                PurchaseItem::create($item);
            }

            if ($purchase->status === 'completed') {
                $this->generatePurchaseJournal($purchase);
            }

            return $purchase->load('items.product');
        });
    }

    public function update(Purchase $purchase, array $data): Purchase
    {
        return DB::transaction(function () use ($purchase, $data) {
            $oldStatus = $purchase->status;
            $items = $data['items'] ?? [];
            unset($data['items']);
            
 
            $purchase->update($data);
            

            $purchase->refresh();
            
            if (!empty($items)) {
                $purchase->items()->delete();
                foreach ($items as $item) {
                    $item['purchase_id'] = $purchase->id;
                    PurchaseItem::create($item);
                }
            }

            if ($purchase->status === 'completed') {
                $this->autoJournalService->deleteByReference('purchase', $purchase->id);
                $this->generatePurchaseJournal($purchase);
            } elseif ($oldStatus === 'completed' && $purchase->status !== 'completed') {
                $this->autoJournalService->deleteByReference('purchase', $purchase->id);
            }

            return $purchase->load('items.product');
        });
    }



    public function delete(Purchase $purchase): bool
    {
        $this->autoJournalService->deleteByReference('purchase', $purchase->id);
        return $this->repository->delete($purchase);
    }

    public function updateStatus(Purchase $purchase, string $status): Purchase
    {
        $oldStatus = $purchase->status;
        $purchase = $this->repository->update($purchase, ['status' => $status]);
        
        $purchase->refresh();

        if ($status === 'completed' && $oldStatus !== 'completed') {
            $this->generatePurchaseJournal($purchase);
        } elseif ($oldStatus === 'completed' && $status !== 'completed') {
            $this->autoJournalService->deleteByReference('purchase', $purchase->id);
        }

        return $purchase;
    }

    public function addPayment(Purchase $purchase, array $data, $user): Purchase
    {
        return DB::transaction(function () use ($purchase, $data, $user) {
            PurchasePayment::create([
                'organization_id' => $purchase->organization_id,
                'purchase_id' => $purchase->id,
                'supplier_id' => $purchase->supplier_id,
                'user_id' => $user->id,
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],
                'reference_no' => $data['reference_no'] ?? null,
                'payment_date' => $data['payment_date'],
                'notes' => $data['notes'] ?? null,
            ]);

            $newPaidAmount = $purchase->paid_amount + $data['amount'];
            $newDueAmount = max(0, $purchase->total_amount - $newPaidAmount);

            $paymentStatus = 'due';
            if ($newPaidAmount <= 0) $paymentStatus = 'due';
            elseif ($newPaidAmount >= $purchase->total_amount) $paymentStatus = 'paid';
            else $paymentStatus = 'partial';

            $purchase->update([
                'paid_amount' => $newPaidAmount,
                'due_amount' => $newDueAmount,
                'payment_status' => $paymentStatus,
            ]);

            return $purchase->fresh();
        });
    }

    private function generatePurchaseJournal(Purchase $purchase)
    {
        if ($purchase->total_amount <= 0) {
            return; 
        }

        $items = [];
        
        $purchaseAccount = Account::where('organization_id', $purchase->organization_id)
            ->whereIn('type', ['expense', 'asset'])
            ->where(function($q) {
                $q->where('name', 'like', '%Purchase%')
                  ->orWhere('name', 'like', '%Inventory%')
                  ->orWhere('name', 'like', '%Stock%');
            })->first();


        if (!$purchaseAccount) {
            $purchaseAccount = Account::where('organization_id', $purchase->organization_id)
                ->where('type', 'expense')
                ->where('status', 'active')
                ->first();
        }
            
        if ($purchaseAccount) {
            $items[] = [
                'account_id' => $purchaseAccount->id,
                'debit' => $purchase->total_amount,
                'credit' => 0,
                'description' => "Purchase for {$purchase->reference_no}"
            ];
        } else {
            throw new \Exception("Cannot create Journal Entry: No Expense or Asset account found. Please create a 'Purchase' or 'Inventory' account in Chart of Accounts.");
        }


        if ($purchase->paid_amount > 0) {
            $paymentAccount = null;
            if (!empty($purchase->payment_account_id)) {
                $paymentAccount = Account::find($purchase->payment_account_id);
            }
            

            if (!$paymentAccount) {
                $paymentAccount = Account::where('organization_id', $purchase->organization_id)
                    ->where('type', 'asset')
                    ->where('name', 'like', '%Cash%')->first();
            }

            if ($paymentAccount) {
                $items[] = [
                    'account_id' => $paymentAccount->id,
                    'debit' => 0,
                    'credit' => $purchase->paid_amount,
                    'description' => "Payment for Purchase {$purchase->reference_no}"
                ];
            } else {
                throw new \Exception("Cannot create Journal Entry: Paid amount is > 0, but no Payment/Cash account is selected or found.");
            }
        }

    
        if ($purchase->due_amount > 0) {
            $apAccount = Account::where('organization_id', $purchase->organization_id)
                ->where('type', 'liability')
                ->where('name', 'like', '%Payable%')->first();
                
            if ($apAccount) {
                $items[] = [
                    'account_id' => $apAccount->id,
                    'debit' => 0,
                    'credit' => $purchase->due_amount,
                    'description' => "Accounts Payable for Purchase {$purchase->reference_no}"
                ];
            } else {
                throw new \Exception("Cannot create Journal Entry: Due amount is > 0, but no 'Accounts Payable' liability account found. Please create one in Chart of Accounts.");
            }
        }

        if (count($items) >= 2) {
            $this->autoJournalService->createAndPost(
                'purchase', $purchase->id, $purchase->organization_id, $purchase->branch_id, $purchase->user_id, $items
            );
        } else {
            throw new \Exception("Cannot create Journal Entry: Missing required accounts. Ensure you have Expense/Asset, Cash/Bank, and Accounts Payable accounts set up.");
        }
    }
}
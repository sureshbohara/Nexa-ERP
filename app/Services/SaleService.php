<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Repositories\SaleRepository;
use Illuminate\Support\Facades\DB;

class SaleService
{
    public function __construct(
        protected SaleRepository $repository,
        protected AutoJournalService $autoJournalService
    ) {}

    public function getAll() { return $this->repository->getAll(); }

    public function create(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $sale = $this->repository->create($data);
            
            foreach ($items as $item) {
                $item['sale_id'] = $sale->id;
                SaleItem::create($item);
            }

            if ($sale->status === 'completed') {
                $this->generateSaleJournal($sale);
            }

            return $sale->load('items.product');
        });
    }

    public function update(Sale $sale, array $data): Sale
    {
        return DB::transaction(function () use ($sale, $data) {
            $oldStatus = $sale->status;
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $sale->update($data);
            
            if (!empty($items)) {
                $sale->items()->delete();
                foreach ($items as $item) {
                    $item['sale_id'] = $sale->id;
                    SaleItem::create($item);
                }
            }

            if ($sale->status === 'completed') {
                $this->autoJournalService->deleteByReference('sale', $sale->id);
                $this->generateSaleJournal($sale);
            } elseif ($oldStatus === 'completed' && $sale->status !== 'completed') {
                $this->autoJournalService->deleteByReference('sale', $sale->id);
            }

            return $sale->load('items.product');
        });
    }

    public function delete(Sale $sale): bool 
    { 
        $this->autoJournalService->deleteByReference('sale', $sale->id);
        return $this->repository->delete($sale); 
    }

    public function updateStatus(Sale $sale, string $status): Sale
    {
        $oldStatus = $sale->status;
        $sale = $this->repository->update($sale, ['status' => $status]);

        if ($status === 'completed' && $oldStatus !== 'completed') {
            $this->generateSaleJournal($sale);
        } elseif ($oldStatus === 'completed' && $status !== 'completed') {
            $this->autoJournalService->deleteByReference('sale', $sale->id);
        }

        return $sale;
    }

    public function addPayment(Sale $sale, array $data, $user): Sale
    {
        return DB::transaction(function () use ($sale, $data, $user) {
            SalePayment::create([
                'organization_id' => $sale->organization_id,
                'sale_id' => $sale->id,
                'customer_id' => $sale->customer_id,
                'user_id' => $user->id,
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],
                'reference_no' => $data['reference_no'] ?? null,
                'payment_date' => $data['payment_date'],
                'notes' => $data['notes'] ?? null,
            ]);

            $newPaidAmount = $sale->paid_amount + $data['amount'];
            $newDueAmount = max(0, $sale->total_amount - $newPaidAmount);

            $paymentStatus = 'due';
            if ($newPaidAmount <= 0) $paymentStatus = 'due';
            elseif ($newPaidAmount >= $sale->total_amount) $paymentStatus = 'paid';
            else $paymentStatus = 'partial';

            $sale->update([
                'paid_amount' => $newPaidAmount,
                'due_amount' => $newDueAmount,
                'payment_status' => $paymentStatus,
            ]);

            return $sale->fresh();
        });
    }

    private function generateSaleJournal(Sale $sale)
    {
        $items = [];
        

        $salesAccount = Account::where('organization_id', $sale->organization_id)
            ->where('type', 'income')
            ->where(function($q) {
                $q->where('name', 'like', '%Sales%')
                  ->orWhere('name', 'like', '%Revenue%');
            })->first();


        if (!$salesAccount) {
            $salesAccount = Account::where('organization_id', $sale->organization_id)
                ->where('type', 'income')
                ->where('status', 'active')
                ->first();
        }

        if ($salesAccount) {
            $items[] = [
                'account_id' => $salesAccount->id,
                'debit' => 0,
                'credit' => $sale->total_amount,
                'description' => "Sales Revenue for {$sale->reference_no}"
            ];
        } else {
            throw new \Exception("Cannot create Journal Entry: No Income account found. Please create a 'Sales' or 'Revenue' account in Chart of Accounts.");
        }

   
        if ($sale->paid_amount > 0) {
            $paymentAccount = null;
            if (!empty($sale->payment_account_id)) {
                $paymentAccount = Account::find($sale->payment_account_id);
            }
            
            if (!$paymentAccount) {
                $paymentAccount = Account::where('organization_id', $sale->organization_id)
                    ->where('type', 'asset')
                    ->where('name', 'like', '%Cash%')->first();
            }

            if ($paymentAccount) {
                $items[] = [
                    'account_id' => $paymentAccount->id,
                    'debit' => $sale->paid_amount,
                    'credit' => 0,
                    'description' => "Cash/Bank received for Sale {$sale->reference_no}"
                ];
            } else {
                throw new \Exception("Cannot create Journal Entry: Paid amount is > 0, but no Payment/Cash account is selected or found.");
            }
        }

    
        if ($sale->due_amount > 0) {
            $arAccount = Account::where('organization_id', $sale->organization_id)
                ->where('type', 'asset')
                ->where('name', 'like', '%Receivable%')->first();
                
            if ($arAccount) {
                $items[] = [
                    'account_id' => $arAccount->id,
                    'debit' => $sale->due_amount,
                    'credit' => 0,
                    'description' => "Accounts Receivable for Sale {$sale->reference_no}"
                ];
            } else {
                throw new \Exception("Cannot create Journal Entry: Due amount is > 0, but no 'Accounts Receivable' asset account found. Please create one in Chart of Accounts.");
            }
        }

        if (count($items) >= 2) {
            $this->autoJournalService->createAndPost(
                'sale', $sale->id, $sale->organization_id, $sale->branch_id, $sale->user_id, $items
            );
        } else {
            throw new \Exception("Cannot create Journal Entry: Missing required accounts. Ensure you have Income, Cash/Bank, and Accounts Receivable accounts set up.");
        }
    }
}
<?php

namespace App\Services;

use App\Models\BankAccount;
use App\Models\BankTransaction;
use App\Repositories\BankTransactionRepository;
use Illuminate\Support\Facades\DB;

class BankTransactionService
{
    public function __construct(protected BankTransactionRepository $repository) {}


    public function getAll() { return $this->repository->getAll(); }



    public function create(array $data): BankTransaction
    {
        return DB::transaction(function () use ($data) {
            $transaction = $this->repository->create($data);
            
            $bankAccount = BankAccount::find($data['bank_account_id']);
            if ($bankAccount) {
                if ($data['type'] === 'deposit') {
                    $bankAccount->current_balance += $data['amount'];
                } else {
                    $bankAccount->current_balance -= $data['amount'];
                }
                $bankAccount->save();
            }
            
            return $transaction->load('bankAccount');
        });
    }




    public function update(BankTransaction $transaction, array $data): BankTransaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            $oldBankAccount = BankAccount::find($transaction->bank_account_id);
            $newBankAccountId = $data['bank_account_id'] ?? $transaction->bank_account_id;
            $newBankAccount = BankAccount::find($newBankAccountId);

            if ($oldBankAccount) {
           
                if ($transaction->type === 'deposit') {
                    $oldBankAccount->current_balance -= $transaction->amount;
                } else {
                    $oldBankAccount->current_balance += $transaction->amount;
                }
                $oldBankAccount->save();
            }

            if ($newBankAccount) {
            
                if ($data['type'] === 'deposit') {
                    $newBankAccount->current_balance += $data['amount'];
                } else {
                    $newBankAccount->current_balance -= $data['amount'];
                }
                $newBankAccount->save();
            }

            $transaction->update($data);
            return $transaction->fresh()->load('bankAccount');
        });
    }



    public function delete(BankTransaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            $bankAccount = BankAccount::find($transaction->bank_account_id);
            if ($bankAccount) {
                if ($transaction->type === 'deposit') {
                    $bankAccount->current_balance -= $transaction->amount;
                } else {
                    $bankAccount->current_balance += $transaction->amount;
                }
                $bankAccount->save();
            }
            
            return $this->repository->delete($transaction);
        });
    }
}
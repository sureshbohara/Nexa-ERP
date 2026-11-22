<?php

namespace App\Services;

use App\Models\Expense;
use App\Repositories\ExpenseRepository;
use Illuminate\Support\Facades\Storage;

class ExpenseService
{
    public function __construct(
        protected ExpenseRepository $repository,
        protected AutoJournalService $autoJournalService
    ) {}

    public function getAll() { return $this->repository->getAll(); }

    public function create(array $data): Expense
    {
        if (isset($data['reference_document']) && $data['reference_document'] instanceof \Illuminate\Http\UploadedFile) {
            $data['reference_document'] = $data['reference_document']->store('expenses', 'public');
        }
        
        $expense = $this->repository->create($data);

        if ($expense->status === 'approved') {
            $this->generateExpenseJournal($expense);
        }

        return $expense;
    }

    public function update(Expense $expense, array $data): Expense
    {
        $oldStatus = $expense->status;

        if (isset($data['reference_document']) && $data['reference_document'] instanceof \Illuminate\Http\UploadedFile) {
            if ($expense->reference_document) {
                Storage::disk('public')->delete($expense->reference_document);
            }
            $data['reference_document'] = $data['reference_document']->store('expenses', 'public');
        }
        
        $expense = $this->repository->update($expense, $data);

        if ($expense->status === 'approved') {
            $this->autoJournalService->deleteByReference('expense', $expense->id);
            $this->generateExpenseJournal($expense);
        } elseif ($oldStatus === 'approved' && $expense->status !== 'approved') {
            $this->autoJournalService->deleteByReference('expense', $expense->id);
        }

        return $expense;
    }

    public function delete(Expense $expense): bool
    {
        $this->autoJournalService->deleteByReference('expense', $expense->id);
        
        if ($expense->reference_document) {
            Storage::disk('public')->delete($expense->reference_document);
        }
        return $this->repository->delete($expense);
    }

    public function updateStatus(Expense $expense, string $status): Expense
    {
        $oldStatus = $expense->status;
        $expense = $this->repository->update($expense, ['status' => $status]);

        if ($status === 'approved' && $oldStatus !== 'approved') {
            $this->generateExpenseJournal($expense);
        } elseif ($oldStatus === 'approved' && $status !== 'approved') {
            $this->autoJournalService->deleteByReference('expense', $expense->id);
        }

        return $expense;
    }

    private function generateExpenseJournal(Expense $expense)
    {
        $items = [];
        
        // 1. Debit: The Expense Account selected by user
        $items[] = [
            'account_id' => $expense->account_id,
            'debit' => $expense->total_amount,
            'credit' => 0,
            'description' => "Expense: {$expense->reference_no}"
        ];

        // 2. Credit: The Payment Account (Cash/Bank) selected by user
        if (!empty($expense->payment_account_id)) {
            $items[] = [
                'account_id' => $expense->payment_account_id,
                'debit' => 0,
                'credit' => $expense->total_amount,
                'description' => "Payment for Expense: {$expense->reference_no}"
            ];
        }

        if (count($items) >= 2) {
            $this->autoJournalService->createAndPost(
                'expense', $expense->id, $expense->organization_id, $expense->branch_id, $expense->user_id, $items
            );
        }
    }
}
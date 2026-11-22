<?php

namespace App\Services;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalItem;
use Illuminate\Support\Facades\DB;

class AutoJournalService
{
    public function createAndPost(string $referenceType, int $referenceId, int $organizationId, ?int $branchId, ?int $userId, array $journalItems)
    {
        DB::transaction(function () use ($referenceType, $referenceId, $organizationId, $branchId, $userId, $journalItems) {
            $totalDebit = 0;
            $totalCredit = 0;

            foreach ($journalItems as $item) {
                $totalDebit += (float)($item['debit'] ?? 0);
                $totalCredit += (float)($item['credit'] ?? 0);
            }

            if (abs($totalDebit - $totalCredit) > 0.01) {
                throw new \Exception("Auto Journal Entry failed: Debit ({$totalDebit}) and Credit ({$totalCredit}) must be equal for {$referenceType} #{$referenceId}");
            }

            $journalEntry = JournalEntry::create([
                'organization_id' => $organizationId,
                'branch_id' => $branchId,
                'user_id' => $userId,
                'reference_no' => 'AUTO-' . strtoupper(substr($referenceType, 0, 3)) . '-' . $referenceId . '-' . time(),
                'entry_date' => now(),
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'total_debit' => round($totalDebit, 2),
                'total_credit' => round($totalCredit, 2),
                'status' => 'posted',
                'notes' => "Auto-generated from {$referenceType} ID: {$referenceId}",
            ]);

            foreach ($journalItems as $item) {
                JournalItem::create([
                    'journal_entry_id' => $journalEntry->id,
                    'account_id' => $item['account_id'],
                    'description' => $item['description'] ?? "Auto entry for {$referenceType}",
                    'debit' => round($item['debit'] ?? 0, 2),
                    'credit' => round($item['credit'] ?? 0, 2),
                ]);
            }
        });
    }

    public function deleteByReference(string $referenceType, int $referenceId)
    {
        JournalEntry::where('reference_type', $referenceType)
                    ->where('reference_id', $referenceId)
                    ->delete();
    }
}
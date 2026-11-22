<?php

namespace App\Services;

use App\Models\JournalEntry;
use App\Models\JournalItem;
use App\Repositories\JournalEntryRepository;
use Illuminate\Support\Facades\DB;

class JournalEntryService
{
    public function __construct(protected JournalEntryRepository $repository) {}

    public function getAll() { return $this->repository->getAll(); }

    public function create(array $data): JournalEntry
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $entry = $this->repository->create($data);
            
            foreach ($items as $item) {
                $item['journal_entry_id'] = $entry->id;
                JournalItem::create($item);
            }
            
            return $entry->load('items.account');
        });
    }

    public function update(JournalEntry $entry, array $data): JournalEntry
    {
        return DB::transaction(function () use ($entry, $data) {
            if ($entry->status === 'posted') {
                throw new \Exception('Posted journal entries cannot be updated.');
            }

            $items = $data['items'] ?? [];
            unset($data['items']);
            
            $entry->update($data);
            
            if (!empty($items)) {
                $entry->items()->delete();
                foreach ($items as $item) {
                    $item['journal_entry_id'] = $entry->id;
                    JournalItem::create($item);
                }
            }
            
            return $entry->load('items.account');
        });
    }

    public function delete(JournalEntry $entry): bool
    {
        if ($entry->status === 'posted') {
            throw new \Exception('Posted journal entries cannot be deleted.');
        }
        return $this->repository->delete($entry);
    }

    public function post(JournalEntry $entry): JournalEntry
    {
        if (!$entry->isBalanced()) {
            throw new \Exception('Journal entry must be balanced before posting.');
        }
        return $this->repository->update($entry, ['status' => 'posted']);
    }

    public function cancel(JournalEntry $entry): JournalEntry
    {
        if ($entry->status === 'posted') {
            throw new \Exception('Posted journal entries cannot be cancelled.');
        }
        return $this->repository->update($entry, ['status' => 'cancelled']);
    }
}
<?php

namespace App\Repositories;

use App\Models\JournalEntry;

class JournalEntryRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new JournalEntry(); }

    public function getAll()
    {
        return $this->model
            ->with(['user:id,name', 'items.account:id,name,code'])
            ->latest('entry_date')
            ->get();
    }
}
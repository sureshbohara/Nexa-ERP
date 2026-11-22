<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditableObserver
{
    
    public function created(Model $model): void
    {
        $this->log($model, 'created', null, $model->getAttributes());
    }

 
    public function updated(Model $model): void
    {
        if ($model->isDirty()) {
            $this->log(
                $model,
                'updated',
                $model->getOriginal(),
                $model->getDirty()
            );
        }
    }

  
    public function deleted(Model $model): void
    {
        $this->log($model, 'deleted', $model->getAttributes(), null);
    }

 
    private function log(Model $model, string $event, ?array $oldValues, ?array $newValues): void
    {
        $user = Auth::user();


        $oldValues = $this->filterSensitive($oldValues);
        $newValues = $this->filterSensitive($newValues);

        AuditLog::create([
            'organization_id' => $user?->organization_id ?? $model->organization_id ?? null,
            'branch_id' => $user?->branch_id ?? $model->branch_id ?? null,
            'user_id' => $user?->id,
            'event' => $event,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'url' => Request::fullUrl(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }


    private function filterSensitive(?array $data): ?array
    {
        if (!$data) return null;

        $sensitive = ['password', 'remember_token', 'token', 'secret', 'credentials'];
        
        foreach ($sensitive as $field) {
            if (isset($data[$field])) {
                $data[$field] = '***REDACTED***';
            }
        }

        return $data;
    }
}
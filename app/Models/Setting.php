<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'group',
        'key',
        'value',
        'type',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'json',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function scopeGlobal($query)
    {
        return $query->whereNull('organization_id');
    }

    public function scopeForOrganization($query, ?int $organizationId)
    {
        return $query->where(function ($q) use ($organizationId) {
            $q->whereNull('organization_id');

            if ($organizationId) {
                $q->orWhere('organization_id', $organizationId);
            }
        });
    }

    public function scopeGroup($query, string $group)
    {
        return $query->where('group', $group);
    }
}
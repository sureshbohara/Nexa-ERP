<?php

namespace App\Models;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory, Auditable, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'price',
        'billing_cycle',
        'features',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeMonthly($query)
    {
        return $query->where('billing_cycle', 'monthly');
    }

    public function scopeYearly($query)
    {
        return $query->where('billing_cycle', 'yearly');
    }

    public function hasFeature(string $module): bool
    {
        $modules = $this->features['modules'] ?? [];

        if (in_array('*', $modules, true)) {
            return true;
        }

        return in_array($module, $modules, true);
    }

    public function getLimit(string $key, int $default = 0): int
    {
        return (int) ($this->features[$key] ?? $default);
    }

    public function getIsUnlimitedUsersAttribute(): bool
    {
        return $this->getLimit('max_users') === -1;
    }
}
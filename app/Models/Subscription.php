<?php

namespace App\Models;

use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Subscription extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'plan_id',
        'start_date',
        'end_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());

        static::creating(function ($model) {
            if (!$model->organization_id) {
                $user = Auth::user();

                if ($user && $user->organization_id) {
                    $model->organization_id = $user->organization_id;
                }
            }
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(SubscriptionInvoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['active', 'trial']);
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date->isPast();
    }

    public function getIsUsableAttribute(): bool
    {
        if (!in_array($this->status, ['active', 'trial'], true)) {
            return false;
        }

        return !$this->is_expired;
    }

    public function getDaysRemainingAttribute(): int
    {
        if ($this->is_expired) {
            return 0;
        }

        return (int) now()->startOfDay()->diffInDays($this->end_date->startOfDay(), false);
    }

    public function hasFeature(string $module): bool
    {
        if (!$this->plan) {
            return false;
        }

        return $this->plan->hasFeature($module);
    }
}
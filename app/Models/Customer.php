<?php

namespace App\Models;
use App\Traits\Auditable;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{
    use HasFactory, Auditable, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'contact_person',
        'phone',
        'alternate_phone',
        'email',
        'tax_number',
        'company_name',
        'province',
        'district',
        'municipality',
        'address',
        'credit_limit',
        'opening_balance',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'credit_limit' => 'decimal:2',
            'opening_balance' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());

        static::creating(function ($model) {
            if (!$model->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $model->organization_id = $user->organization_id ?? Organization::value('id');
                }
            }
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function saleReturns(): HasMany
    {
        return $this->hasMany(SaleReturn::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SalePayment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getDueAmountAttribute(): float
    {
        $totalSales = $this->sales()->sum('total_amount');
        $totalReturns = $this->saleReturns()->sum('total_amount');
        $totalPayments = $this->payments()->sum('amount');

        return ($totalSales - $totalReturns - $totalPayments) + $this->opening_balance;
    }
}
<?php

namespace App\Models;

use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class SalaryStructure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'basic_salary',
        'house_rent_allowance',
        'transport_allowance',
        'medical_allowance',
        'other_allowance',
        'provident_fund',
        'tax_deduction',
        'other_deduction',
        'description',
        'status',
    ];

    protected $appends = [
        'total_allowance',
        'total_deduction',
        'gross_salary',
        'net_salary',
    ];

    protected function casts(): array
    {
        return [
            'basic_salary'           => 'decimal:2',
            'house_rent_allowance'   => 'decimal:2',
            'transport_allowance'    => 'decimal:2',
            'medical_allowance'      => 'decimal:2',
            'other_allowance'        => 'decimal:2',
            'provident_fund'         => 'decimal:2',
            'tax_deduction'          => 'decimal:2',
            'other_deduction'        => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());

        static::creating(function (self $model) {
            if (!$model->organization_id) {
                $user = Auth::user();

                $model->organization_id = $user?->organization_id
                    ?? Organization::query()->value('id');
            }
        });
    }



    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

 

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }



    public function getTotalAllowanceAttribute(): float
    {
        return (float) $this->house_rent_allowance
            + (float) $this->transport_allowance
            + (float) $this->medical_allowance
            + (float) $this->other_allowance;
    }

    public function getTotalDeductionAttribute(): float
    {
        return (float) $this->provident_fund
            + (float) $this->tax_deduction
            + (float) $this->other_deduction;
    }

    public function getGrossSalaryAttribute(): float
    {
        return (float) $this->basic_salary + $this->total_allowance;
    }

    public function getNetSalaryAttribute(): float
    {
        return $this->gross_salary - $this->total_deduction;
    }
}

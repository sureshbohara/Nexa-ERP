<?php

namespace App\Models;
use App\Traits\Auditable;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Payslip extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'organization_id',
        'payroll_id',
        'employee_id',
        'salary_structure_id',
        'pay_period',
        'basic_salary',
        'house_rent_allowance',
        'transport_allowance',
        'medical_allowance',
        'other_allowance',
        'overtime_amount',
        'bonus',
        'provident_fund',
        'tax_deduction',
        'other_deduction',
        'gross_salary',
        'total_deductions',
        'net_salary',
        'payment_status',
        'paid_at',
        'notes',
    ];

    protected $appends = [
        'total_allowance',
        'total_deduction',
    ];

    protected function casts(): array
    {
        return [
            'basic_salary'         => 'decimal:2',
            'house_rent_allowance' => 'decimal:2',
            'transport_allowance'  => 'decimal:2',
            'medical_allowance'    => 'decimal:2',
            'other_allowance'      => 'decimal:2',
            'overtime_amount'      => 'decimal:2',
            'bonus'                => 'decimal:2',
            'provident_fund'       => 'decimal:2',
            'tax_deduction'        => 'decimal:2',
            'other_deduction'      => 'decimal:2',
            'gross_salary'         => 'decimal:2',
            'total_deductions'     => 'decimal:2',
            'net_salary'           => 'decimal:2',
            'paid_at'              => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());

        static::creating(function ($model) {
            if (empty($model->organization_id)) {
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

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(Payroll::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function salaryStructure(): BelongsTo
    {
        return $this->belongsTo(SalaryStructure::class);
    }

    public function getTotalAllowanceAttribute(): float
    {
        return (float) $this->house_rent_allowance + (float) $this->transport_allowance +
               (float) $this->medical_allowance + (float) $this->other_allowance +
               (float) $this->overtime_amount + (float) $this->bonus;
    }

    public function getTotalDeductionAttribute(): float
    {
        return (float) $this->provident_fund + (float) $this->tax_deduction + (float) $this->other_deduction;
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'unpaid');
    }
}
<?php

namespace App\Models;
use App\Traits\Auditable;
use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Payroll extends Model
{
    use HasFactory,Auditable, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'user_id',
        'payroll_period',
        'start_date',
        'end_date',
        'total_employees',
        'total_basic',
        'total_allowances',
        'total_deductions',
        'net_payable',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date'       => 'date',
            'end_date'         => 'date',
            'total_employees'  => 'integer',
            'total_basic'      => 'decimal:2',
            'total_allowances' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'net_payable'      => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
        static::addGlobalScope(new BranchScope());

        static::creating(function ($model) {
            $user = Auth::user();

            if (!$user) {
                return;
            }

            $model->organization_id ??= $user->organization_id
                ?? Organization::value('id');

            $model->branch_id ??= $user->branch_id;
            $model->user_id ??= $user->id;
        });
    }

    // Relationships

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }

    // Query Scopes

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeProcessed($query)
    {
        return $query->where('status', 'processed');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }
}

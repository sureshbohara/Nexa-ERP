<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
class LeaveApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'employee_id',
        'leave_type_id',
        'applied_by',
        'approved_by',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'total_days' => 'integer',
        ];
    }


     protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
        static::addGlobalScope(new BranchScope());

        static::creating(function ($model) {
            if (!$model->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $model->organization_id = $user->organization_id ?? Organization::value('id');
                    if (!$model->branch_id) {
                        $model->branch_id = $user->branch_id ?? Branch::where('organization_id', $model->organization_id)->value('id');
                    }
                }
            }
        });
    }

 
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function appliedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applied_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }
}
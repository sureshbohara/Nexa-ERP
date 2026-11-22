<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'user_id',
        'department_id',
        'employee_code',
        'designation',
        'date_of_joining',
        'date_of_birth',
        'blood_group',
        'marital_status',
        'nationality',
        'permanent_address',
        'temporary_address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'education',
        'experience',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_joining' => 'date',
            'date_of_birth' => 'date',
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
                    $model->organization_id = $user->organization_id
                        ?? Organization::value('id');
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function salaryStructure(): BelongsTo
    {
        return $this->belongsTo(SalaryStructure::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveApplications(): HasMany
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }

 
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }
}

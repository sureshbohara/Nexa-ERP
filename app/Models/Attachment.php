<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'employee_id',
        'attendance_date',
        'check_in',
        'check_out',
        'status',
        'late_minutes',
        'early_leave_minutes',
        'overtime_minutes',
        'working_hours',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
            'check_in' => 'datetime',
            'check_out' => 'datetime',
            'late_minutes' => 'integer',
            'early_leave_minutes' => 'integer',
            'overtime_minutes' => 'integer',
            'working_hours' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
        static::addGlobalScope(new BranchScope());

        static::creating(function ($model) {
            $user = Auth::user();
            
            if ($user) {

                if (!$model->organization_id) {
                    $model->organization_id = $user->organization_id ?? Organization::value('id');
                }
                
                if (!$model->branch_id) {
                    $model->branch_id = $user->branch_id;
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

    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    public function scopeLeave($query)
    {
        return $query->where('status', 'leave');
    }


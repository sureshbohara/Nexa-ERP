<?php

namespace App\Models;

use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'days_allowed',
        'is_paid',
        'is_carried_forward',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'days_allowed' => 'integer',
            'is_paid' => 'boolean',
            'is_carried_forward' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function leaveApplications(): HasMany
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
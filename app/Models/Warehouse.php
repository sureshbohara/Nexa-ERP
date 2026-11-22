<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'name',
        'code',
        'address',
        'manager_name',
        'phone',
        'email',
        'status',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
        static::addGlobalScope(new BranchScope());
        
        static::creating(function ($warehouse) {
            if (!$warehouse->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $warehouse->organization_id = $user->organization_id ?? Organization::value('id');
                    
                    if (!$warehouse->branch_id) {
                        $warehouse->branch_id = $user->branch_id 
                            ?? Branch::where('organization_id', $warehouse->organization_id)->value('id');
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

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function productStocks(): HasMany
    {
        return $this->hasMany(ProductStock::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
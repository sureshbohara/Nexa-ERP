<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'product_id',
        'warehouse_id',
        'user_id',
        'type',
        'quantity',
        'reference_type',
        'reference_id',
        'batch_number',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
        static::addGlobalScope(new BranchScope());

        static::creating(function ($movement) {
            if (!$movement->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $movement->organization_id = $user->organization_id ?? Organization::value('id');
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

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeStockIn($query) { return $query->where('type', 'stock_in'); }

    public function scopeStockOut($query) { return $query->where('type', 'stock_out'); }

    public function scopeTransfer($query) { return $query->where('type', 'transfer'); }

    public function scopeAdjustment($query) { return $query->where('type', 'adjustment'); }
    
}
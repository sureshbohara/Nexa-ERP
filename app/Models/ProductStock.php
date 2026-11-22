<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class ProductStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'product_id',
        'warehouse_id',
        'quantity',
        'batch_number',
        'expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'expiry_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());
        static::addGlobalScope(new BranchScope());

        static::creating(function ($stock) {
            if (!$stock->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $stock->organization_id = $user->organization_id ?? Organization::value('id');
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
}
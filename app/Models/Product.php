<?php

namespace App\Models;
use App\Traits\Auditable;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
class Product extends Model
{
    use HasFactory,Auditable, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'category_id',
        'brand_id',
        'unit_id',
        'name',
        'sku',
        'barcode',
        'description',
        'image',
        'purchase_price',
        'selling_price',
        'tax_rate',
        'low_stock_threshold',
        'has_variants',
        'has_serial_number',
        'has_batch',
        'has_expiry',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'low_stock_threshold' => 'integer',
            'has_variants' => 'boolean',
            'has_serial_number' => 'boolean',
            'has_batch' => 'boolean',
            'has_expiry' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());


        static::creating(function ($model) {
            if (!$model->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $model->organization_id = $user->organization_id ?? Organization::value('id');
                }
            }
        });


        static::deleting(function (Product $product) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(ProductStock::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function getImageUrlAttribute(): string
    {
        if ($this->image) {
            return Storage::disk('public')->url($this->image);
        }
        return asset('default/noimage.png');
    }

    public function getProfitMarginAttribute(): float
    {
        if ($this->selling_price <= 0) {
            return 0;
        }
        return round(
            (($this->selling_price - $this->purchase_price) / $this->selling_price) * 100,
            2
        );
    }

    public function getTotalStockAttribute(): int
    {
        return $this->stocks()->sum('quantity');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('low_stock_threshold', '>', 0);
    }
}
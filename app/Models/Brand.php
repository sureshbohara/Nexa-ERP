<?php

namespace App\Models;

use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Brand extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'description',
        'logo',
        'status',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());

        static::creating(function ($brand) {
            if (!$brand->organization_id) {
                $user = Auth::user();
                if ($user) {
                    $brand->organization_id = $user->organization_id ?? Organization::value('id');
                }
            }
        });

        static::deleting(function ($brand) {
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
        });
    }

    public function getLogoUrlAttribute(): string
    {
        return $this->logo
            ? Storage::disk('public')->url($this->logo)
            : asset('default/noimage.png');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
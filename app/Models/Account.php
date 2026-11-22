<?php

namespace App\Models;
use App\Traits\Auditable;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Account extends Model
{
    use HasFactory,Auditable, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'parent_id',
        'code',
        'name',
        'type',
        'sub_type',
        'description',
        'is_system',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
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
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function journalItems(): HasMany
    {
        return $this->hasMany(JournalItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function getBalanceAttribute(): float
    {
        $debits = $this->journalItems()->sum('debit');
        $credits = $this->journalItems()->sum('credit');

        if (in_array($this->type, ['asset', 'expense'])) {
            return $debits - $credits;
        }

        return $credits - $debits;
    }
}
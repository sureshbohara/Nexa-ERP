<?php

namespace App\Models;
use App\Traits\Auditable;
use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
class JournalEntry extends Model
{
    use HasFactory,Auditable, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'user_id',
        'reference_no',
        'entry_date',
        'reference_type',
        'reference_id',
        'total_debit',
        'total_credit',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
            'total_debit' => 'decimal:2',
            'total_credit' => 'decimal:2',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(JournalItem::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }

    public function scopePosted($query)
    {
        return $query->where('status', 'posted');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function isBalanced(): bool
    {
        return $this->total_debit == $this->total_credit;
    }
}
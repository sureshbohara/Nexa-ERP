<?php

namespace App\Models;

use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class SubscriptionPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'subscription_id',
        'subscription_invoice_id',
        'payment_gateway_id',
        'user_id',
        'amount',
        'currency',
        'payment_method',
        'transaction_id',
        'gateway_response',
        'payment_date',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount'           => 'decimal:2',
            'payment_date'     => 'date',
            'gateway_response' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new OrganizationScope());

        static::creating(function ($model) {
            $user = Auth::user();

            if ($user) {
                if (empty($model->organization_id)) {
                    $model->organization_id = $user->organization_id
                        ?? Organization::value('id');
                }

                if (empty($model->user_id)) {
                    $model->user_id = $user->id;
                }
            }
        });
    }

    // Relationships

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(
            SubscriptionInvoice::class,
            'subscription_invoice_id'
        );
    }

    public function gateway(): BelongsTo
    {
        return $this->belongsTo(
            PaymentGateway::class,
            'payment_gateway_id'
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Query Scopes

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}

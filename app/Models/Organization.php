<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code', 'registration_number', 'pan_vat_number', 'contact_person',
        'phone', 'alternate_phone', 'email', 'website', 'logo', 'province',
        'district', 'municipality', 'ward_number', 'address', 'established_date', 'status',
    ];

    protected function casts(): array
    {
        return [
            'established_date' => 'date',
        ];
    }

    public function branches(): HasMany 
    { 
        return $this->hasMany(Branch::class); 
    }

    public function users(): HasMany 
    { 
        return $this->hasMany(User::class); 
    }

    public function subscription(): HasOne 
    { 
        return $this->hasOne(Subscription::class)->latestOfMany(); 
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function subscriptionPayments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    public function scopeActive($query) 
    { 
        return $query->where('status', 'active'); 
    }

    public function getLogoUrlAttribute(): string
    {
        if ($this->logo) {
            return Storage::disk('public')->url($this->logo);
        }
        return asset('default/noimage.png');
    }
}
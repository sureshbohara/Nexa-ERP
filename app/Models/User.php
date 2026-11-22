<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Scopes\OrganizationScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'username', 'phone', 'gender',
        'password', 'role_id', 'organization_id', 'branch_id', 'image',
        'bio', 'status', 'last_login_at', 'last_login_ip',
        'address', 'date_of_birth', 'designation', 
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'date_of_birth' => 'date:Y-m-d',
        ];
    }


    protected static function booted(): void
    {

        // static::addGlobalScope(new OrganizationScope());
        // static::addGlobalScope(new BranchScope());
        // static::creating(function ($model) {
        //     if (!$model->organization_id || !$model->branch_id) {
        //         $user = Auth::user();
        //         if ($user) {
        //             $model->organization_id = $user->organization_id ?? Organization::value('id');
        //             $model->branch_id = $user->branch_id; 
        //         }
        //     }
        // });


        static::deleting(function ($user) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
        });
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function getImageUrlAttribute(): string
    {
        if ($this->image) {
            return Storage::disk('public')->url($this->image);
        }
        return asset('default/noimage.png');
    }

    public function role(): BelongsTo
    { 
        return $this->belongsTo(Role::class);
    }

    public function organization(): BelongsTo 
    { 
        return $this->belongsTo(Organization::class);
    }

    public function branch(): BelongsTo 
    { 
        return $this->belongsTo(Branch::class); 
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }
}
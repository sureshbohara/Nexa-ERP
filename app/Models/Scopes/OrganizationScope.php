<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class OrganizationScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        if ($user && strtolower($user->role?->name ?? '') !== 'super admin') {
            if ($user->organization_id) {
                $builder->where('organization_id', $user->organization_id);
            }
        }
    }
}
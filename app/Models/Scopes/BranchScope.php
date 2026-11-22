<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class BranchScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        if ($user) {
            $roleName = strtolower($user->role?->name ?? '');
            
            if (!in_array($roleName, ['super admin', 'admin'])) {
                if ($user->branch_id) {
                    $builder->where('branch_id', $user->branch_id);
                }
            }
        }
    }
}
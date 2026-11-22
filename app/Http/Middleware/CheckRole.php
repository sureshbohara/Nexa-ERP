<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = Auth::user();

        if (!$user || strtolower($user->role?->name ?? '') !== strtolower($role)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
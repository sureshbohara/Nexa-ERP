<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlanFeature
{
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if (!$user || strtolower($user->role?->name ?? '') === 'super admin') {
            return $next($request);
        }

        $subscription = Subscription::withoutGlobalScopes()
            ->where('organization_id', $user->organization_id)
            ->latest('id')
            ->first();

        if (!$subscription || !$subscription->is_usable || !$subscription->hasFeature($module)) {
            abort(403, 'Your current plan does not include the ' . ucfirst($module) . ' module. Please upgrade.');
        }

        return $next($request);
    }
}
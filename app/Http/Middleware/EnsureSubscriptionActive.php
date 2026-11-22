<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || strtolower($user->role?->name ?? '') === 'super admin' || !$user->organization_id) {
            return $next($request);
        }

        $subscription = Subscription::withoutGlobalScopes()
            ->where('organization_id', $user->organization_id)
            ->latest('id')
            ->first();

        if (!$subscription || !$subscription->is_usable) {
            if ($request->expectsJson() || $request->inertia()) {
                return response()->json(['message' => 'Your subscription has expired.'], 402);
            }
            return redirect()->route('subscription.expired')->with('error', 'Your subscription has expired.');
        }

        return $next($request);
    }
}
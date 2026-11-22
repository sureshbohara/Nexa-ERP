<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(LoginRequest $request){
        $response = $this->authService->login($request->validated());

        if (!$response['success']) {
            return back()->withErrors(['login' => $response['message']])->withInput();
        }
        $user = auth()->user();
        if ($user) {
            AuditLog::create([
                'organization_id' => $user->organization_id,
                'branch_id'       => $user->branch_id,
                'user_id'         => $user->id,
                'event'           => 'login',
                'auditable_type'  => get_class($user),
                'auditable_id'    => $user->id,
                'new_values'      => [
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
                'url'             => $request->fullUrl(),
                'ip_address'      => $request->ip(),
                'user_agent'      => $request->userAgent(),
            ]);
        }

        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request){
        $user = auth()->user();
        if ($user) {
            AuditLog::create([
                'organization_id' => $user->organization_id,
                'branch_id'       => $user->branch_id,
                'user_id'         => $user->id,
                'event'           => 'logout',
                'auditable_type'  => get_class($user),
                'auditable_id'    => $user->id,
                'new_values'      => [
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
                'url'             => $request->fullUrl(),
                'ip_address'      => $request->ip(),
                'user_agent'      => $request->userAgent(),
            ]);
        }

        $this->authService->logout();
        return redirect()->route('login')->with('success', 'Logged out successfully.');
    }
}
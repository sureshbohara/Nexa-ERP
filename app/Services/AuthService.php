<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findBy('email', $credentials['login']) 
               ?? $this->userRepository->findBy('username', $credentials['login']);

        if (!$user) {
            return ['success' => false, 'message' => 'Email or Username does not exist.', 'status' => 404];
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return ['success' => false, 'message' => 'Invalid password.', 'status' => 401];
        }

        if ($user->status !== 'active') {
            return ['success' => false, 'message' => 'Your account is inactive. Contact admin.', 'status' => 403];
        }

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);

        Auth::login($user, $credentials['remember'] ?? false);

        return ['success' => true, 'user' => $user, 'status' => 200];
    }

    public function logout(): void
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
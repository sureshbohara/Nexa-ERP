<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Requests\Profile\ChangePasswordRequest;
use App\Services\ProfileService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(private ProfileService $profileService) {}

    public function editProfile()
    {
        return Inertia::render('Profile/UpdateProfile', [
            'user' => Auth::user(),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $this->profileService->updateProfile(Auth::user(), $request->validated());
        return back()->with('success', 'Profile updated successfully!');
    }

    public function showChangePassword()
    {
        return Inertia::render('Profile/ChangePassword');
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $this->profileService->changePassword(Auth::user(), $request->validated());
        return back()->with('success', 'Password changed successfully!');
    }
}
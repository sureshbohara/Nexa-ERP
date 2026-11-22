<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SettingRequest;
use App\Services\SettingService;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(protected SettingService $settingService) {}

    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'settings' => $this->settingService->getAllSettings(),
        ]);
    }

    public function update(SettingRequest $request)
    {
        $this->settingService->updateSettings($request->validated());
        return back()->with('success', 'System settings updated successfully!');
    }
}
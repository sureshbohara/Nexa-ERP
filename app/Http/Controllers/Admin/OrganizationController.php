<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\Organization\OrganizationRequest;
use App\Models\Organization;
use App\Services\OrganizationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function __construct(protected OrganizationService $organizationService) {}

    public function index(): Response
    {
        return Inertia::render('Organizations/Index', [
            'organizations' => $this->organizationService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Organizations/Form', [
            'organization' => null,
        ]);
    }

    public function store(OrganizationRequest $request): RedirectResponse
    {
        $this->organizationService->create($request->validated());
        return redirect()->route('organizations.index')->with('success', 'Organization created successfully.');
    }

    public function edit(Organization $organization): Response
    {
        return Inertia::render('Organizations/Form', [
            'organization' => $organization,
        ]);
    }


    public function update(OrganizationRequest $request, Organization $organization): RedirectResponse
    {
        $this->organizationService->update($organization, $request->validated());
        return redirect()->route('organizations.index')->with('success', 'Organization updated successfully.');
    }


    public function destroy(Organization $organization): RedirectResponse
    {
        $this->organizationService->delete($organization);
        return redirect()->route('organizations.index')->with('success', 'Organization deleted successfully.');
    }


    public function updateStatus(Request $request, Organization $organization): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $this->organizationService->updateStatus($organization, $validated['status']);
        return back()->with('success', 'Organization status updated successfully.');
    }

    
}
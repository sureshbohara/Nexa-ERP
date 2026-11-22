<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\Branch\BranchRequest;
use App\Models\Branch;
use App\Services\BranchService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function __construct(protected BranchService $branchService) {}

    public function index(): Response
    {
        return Inertia::render('Branches/Index', [
            'branches' => $this->branchService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Branches/Form', [
            'branch' => null,
            'organizations' => $this->branchService->getActiveOrganizations(),
        ]);
    }

    public function store(BranchRequest $request): RedirectResponse
    {
        $this->branchService->create($request->validated());
        return redirect()->route('branches.index')->with('success', 'Branch created successfully.');
    }

    public function edit(Branch $branch): Response
    {
        return Inertia::render('Branches/Form', [
            'branch' => $branch->load('organization:id,name'),
            'organizations' => $this->branchService->getActiveOrganizations(),
        ]);
    }

    public function update(BranchRequest $request, Branch $branch): RedirectResponse
    {
        $this->branchService->update($branch, $request->validated());
        return redirect()->route('branches.index')->with('success', 'Branch updated successfully.');
    }

    public function destroy(Branch $branch): RedirectResponse
    {
        $this->branchService->delete($branch);
        return redirect()->route('branches.index')->with('success', 'Branch deleted successfully.');
    }

    public function updateStatus(Request $request, Branch $branch): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $this->branchService->updateStatus($branch, $validated['status']);
        return back()->with('success', 'Branch status updated successfully.');
    }
}
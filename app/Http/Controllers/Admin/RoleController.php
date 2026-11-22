<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\Role\RoleRequest;
use App\Models\Role;
use App\Services\RoleService;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService,
        protected PermissionService $permissionService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Roles/Index', [
            'roles' => $this->roleService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Roles/Form', [
            'role' => null,
            'groupedPermissions' => $this->permissionService->getAllGrouped(),
        ]);
    }

    public function store(RoleRequest $request): RedirectResponse
    {
        $this->roleService->create($request->validated());

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role): Response|RedirectResponse
    {
        if ($role->is_system) {
            return redirect()->route('roles.index')
                ->with('error', 'System roles cannot be modified.');
        }

        return Inertia::render('Roles/Form', [
            'role' => $role->load('permissions:id,name'),
            'groupedPermissions' => $this->permissionService->getAllGrouped(),
        ]);
    }

    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        if ($role->is_system) {
            return back()->with('error', 'System roles cannot be modified.');
        }

        $this->roleService->update($role, $request->validated());

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (!$this->roleService->delete($role)) {
            return back()->with('error', 'System roles cannot be deleted, or role is currently in use.');
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\User\UserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(){
        return Inertia::render('Users/Index', [
            'users' => $this->userService->getAll(auth()->id()),
            'dropdownData' => $this->userService->getDropdownData(),
        ]);
    }

    public function create(){
        return Inertia::render('Users/Form', [
            'user' => null,
            'dropdownData' => $this->userService->getDropdownData(),
        ]);
    }

    public function store(UserRequest $request){
        $this->userService->create($request->validated());
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user){
        return Inertia::render('Users/Form', [
            'user' => $user,
            'dropdownData' => $this->userService->getDropdownData(),
        ]);
    }

    public function update(UserRequest $request, User $user){
        $this->userService->update($user, $request->validated());
        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user){
        $this->userService->delete($user);
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function updateStatus(Request $request, User $user){
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive,suspended'],
        ]);
        $this->userService->update($user, $validated);
        return back()->with('success', 'User status updated successfully.');
    }
}
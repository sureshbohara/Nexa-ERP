<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\AccountRequest;
use App\Models\Account;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function __construct(protected AccountService $service) {}

    public function index(){
        return Inertia::render('Accounting/Accounts/Index', [
            'accounts' => $this->service->getAll(),
        ]);
    }

    public function store(AccountRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Account created successfully.');
    }

    public function update(AccountRequest $request, Account $account){
        $this->service->update($account, $request->validated());
        return back()->with('success', 'Account updated successfully.');
    }

    public function destroy(Account $account){
        try {
            $this->service->delete($account);
            return back()->with('success', 'Account deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateStatus(Request $request, Account $account){
        try {
            $validated = $request->validate(['status' => ['required', 'in:active,inactive']]);
            $this->service->updateStatus($account, $validated['status']);
            return back()->with('success', 'Account status updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
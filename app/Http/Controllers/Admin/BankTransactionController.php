<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\BankTransactionRequest;
use App\Models\BankTransaction;
use App\Models\BankAccount;
use App\Services\BankTransactionService;
use Inertia\Inertia;

class BankTransactionController extends Controller
{
    public function __construct(protected BankTransactionService $service) {}

    public function index(){
        return Inertia::render('Accounting/BankTransactions/Index', [
            'transactions' => $this->service->getAll(),
            'bankAccounts' => BankAccount::where('status', 'active')->get(['id', 'name', 'bank_name', 'account_number', 'current_balance']),
        ]);
    }

    public function store(BankTransactionRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Bank transaction recorded successfully.');
    }

 
    public function update(BankTransactionRequest $request, BankTransaction $bankTransaction){
        $this->service->update($bankTransaction, $request->validated());
        return back()->with('success', 'Bank transaction updated successfully.');
    }


    public function destroy(BankTransaction $bankTransaction){
        $this->service->delete($bankTransaction);
        return back()->with('success', 'Bank transaction deleted and balance reversed successfully.');
    }
    
}
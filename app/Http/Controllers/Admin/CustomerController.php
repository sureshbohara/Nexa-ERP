<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\CustomerRequest;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $service) {}

    public function index(){
        return Inertia::render('Transactions/Customers/Index', [
            'customers' => $this->service->getAll(),
        ]);
    }

    public function store(CustomerRequest $request){
        $this->service->create($request->validated());

        return back()->with('success', 'Customer created successfully.');
    }

    public function update(CustomerRequest $request, Customer $customer){
        $this->service->update($customer, $request->validated());

        return back()->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer){
        $this->service->delete($customer);

        return back()->with('success', 'Customer deleted successfully.');
    }

    public function updateStatus(Request $request, Customer $customer){
        $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $this->service->updateStatus($customer, $request->status);

        return back()->with('success', 'Customer status updated successfully.');
    }
}
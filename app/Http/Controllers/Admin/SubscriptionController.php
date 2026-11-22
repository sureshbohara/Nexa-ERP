<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Saas\SubscriptionRequest;
use App\Models\Subscription;
use App\Models\Organization;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{


    public function index(){
        return Inertia::render('Saas/Subscriptions/Index', [
            'subscriptions' => Subscription::with(['organization:id,name,code', 'plan:id,name,price,billing_cycle'])
                ->latest('start_date')
                ->get(),
            'organizations' => Organization::where('status', 'active')->get(['id', 'name']),
            'plans' => Plan::where('is_active', true)->get(['id', 'name', 'price', 'billing_cycle']),
        ]);
    }

    public function store(SubscriptionRequest $request){
        Subscription::create($request->validated());
        return back()->with('success', 'Subscription created successfully.');
    }

    public function update(SubscriptionRequest $request, Subscription $subscription){
        $subscription->update($request->validated());
        return back()->with('success', 'Subscription updated successfully.');
    }

    public function destroy(Subscription $subscription){
        $subscription->delete();
        return back()->with('success', 'Subscription deleted successfully.');
    }

    public function updateStatus(Request $request, Subscription $subscription){
        $subscription->update(['status' => $request->status]);
        return back()->with('success', 'Subscription status updated successfully.');
    }
}
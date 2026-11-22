<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Saas\PlanRequest;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index(){
        return Inertia::render('Saas/Plans/Index', [
            'plans' => Plan::withCount('subscriptions')->latest()->get(),
        ]);
    }

    public function store(PlanRequest $request){
        $data = $request->validated();
        if (!empty($data['features']) && is_string($data['features'])) {
            $data['features'] = json_decode($data['features'], true);
        }
        Plan::create($data);
        return back()->with('success', 'Plan created successfully.');
    }

    public function update(PlanRequest $request, Plan $plan){
        $data = $request->validated();
        if (!empty($data['features']) && is_string($data['features'])) {
            $data['features'] = json_decode($data['features'], true);
        }
        $plan->update($data);
        return back()->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan){
        $plan->delete();
        return back()->with('success', 'Plan deleted successfully.');
    }

    public function updateStatus(Request $request, Plan $plan)
    {
        $plan->update(['is_active' => $request->status === 'active']);
        return back()->with('success', 'Plan status updated successfully.');
    }
}
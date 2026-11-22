<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Organization;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Sale;
use App\Models\Employee;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = trim($request->query('q', ''));

        if (strlen($query) < 2) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $user = auth()->user();
        $orgId = $user?->organization_id;

        $results = [];


        $results['users'] = User::where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                  ->orWhere('last_name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%")
                  ->orWhere('username', 'like', "%{$query}%");
            })
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'email', 'username'])
            ->map(fn($u) => [
                'id' => $u->id,
                'title' => trim("{$u->first_name} {$u->last_name}"),
                'subtitle' => $u->email,
                'type' => 'user',
                'url' => route('users.edit', $u->id),
            ]);

    
        $results['organizations'] = Organization::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('code', 'like', "%{$query}%");
            })
            ->when($orgId, fn($q) => $q->where('id', $orgId))
            ->limit(5)
            ->get(['id', 'name', 'code'])
            ->map(fn($o) => [
                'id' => $o->id,
                'title' => $o->name,
                'subtitle' => "Code: {$o->code}",
                'type' => 'organization',
                'url' => route('organizations.edit', $o->id),
            ]);

      
        $results['products'] = Product::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('sku', 'like', "%{$query}%")
                  ->orWhere('barcode', 'like', "%{$query}%");
            })
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->where('status', 'active')
            ->limit(5)
            ->get(['id', 'name', 'sku'])
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->name,
                'subtitle' => $p->sku ? "SKU: {$p->sku}" : 'No SKU',
                'type' => 'product',
                'url' => route('inventory.products.edit', $p->id),
            ]);


        $results['customers'] = Customer::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('company_name', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%");
            })
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->where('status', 'active')
            ->limit(5)
            ->get(['id', 'name', 'company_name', 'phone'])
            ->map(fn($c) => [
                'id' => $c->id,
                'title' => $c->name . ($c->company_name ? " ({$c->company_name})" : ''),
                'subtitle' => "Phone: {$c->phone}",
                'type' => 'customer',
                'url' => route('transactions.customers.edit', $c->id),
            ]);

        
        $results['suppliers'] = Supplier::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('company_name', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%");
            })
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->where('status', 'active')
            ->limit(5)
            ->get(['id', 'name', 'company_name', 'phone'])
            ->map(fn($s) => [
                'id' => $s->id,
                'title' => $s->name . ($s->company_name ? " ({$s->company_name})" : ''),
                'subtitle' => "Phone: {$s->phone}",
                'type' => 'supplier',
                'url' => route('transactions.suppliers.edit', $s->id),
            ]);

    
        $results['sales'] = Sale::where('reference_no', 'like', "%{$query}%")
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->limit(5)
            ->get(['id', 'reference_no', 'total_amount', 'sale_date'])
            ->map(fn($s) => [
                'id' => $s->id,
                'title' => "Sale: {$s->reference_no}",
                'subtitle' => "Amount: Rs. " . number_format($s->total_amount, 2) . " | " . Carbon::parse($s->sale_date)->format('d M Y'),
                'type' => 'sale',
                'url' => route('transactions.sales.show', $s->id),
            ]);

     
        $results['employees'] = Employee::where(function ($q) use ($query) {
                $q->whereHas('user', function ($uq) use ($query) {
                    $uq->where('first_name', 'like', "%{$query}%")
                       ->orWhere('last_name', 'like', "%{$query}%");
                })->orWhere('employee_code', 'like', "%{$query}%");
            })
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->where('status', 'active')
            ->with('user:id,first_name,last_name')
            ->limit(5)
            ->get(['id', 'employee_code'])
            ->map(fn($e) => [
                'id' => $e->id,
                'title' => $e->user ? trim("{$e->user->first_name} {$e->user->last_name}") : 'Unknown',
                'subtitle' => "Code: {$e->employee_code}",
                'type' => 'employee',
                'url' => route('hrm.employees.edit', $e->id),
            ]);


        $results = array_filter($results, fn($arr) => count($arr) > 0);

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }
}
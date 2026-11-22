<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\ProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(protected ProductService $service) {}


    public function index() {
        return Inertia::render('Inventory/Products/Index', [
            'products' => $this->service->getAll(),
        ]);
    }


    public function create() {
        return Inertia::render('Inventory/Products/Form', [
            'product' => null,
            'dropdownData' => $this->service->getDropdownData(), 
        ]);
    }


    public function store(ProductRequest $request) {
        $this->service->create($request->validated());
        return redirect()->route('inventory.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product) {
        return Inertia::render('Inventory/Products/Form', [
            'product' => $product,
            'dropdownData' => $this->service->getDropdownData(), 
        ]);
    }

    public function update(ProductRequest $request, Product $product) {
        $this->service->update($product, $request->validated());
        return redirect()->route('inventory.products.index')->with('success', 'Product updated successfully.');
    }


    public function destroy(Product $product) {
        $this->service->delete($product);
        return redirect()->route('inventory.products.index')->with('success', 'Product deleted successfully.');
    }


    public function updateStatus(Request $request, Product $product) {
        $request->validate(['status' => 'required|in:active,inactive']);
        $this->service->updateStatus($product, $request->status);
        return back()->with('success', 'Product status updated successfully.');
    }
    
}
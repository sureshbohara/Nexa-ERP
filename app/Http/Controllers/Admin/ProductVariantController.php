<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\ProductVariantRequest;
use App\Models\ProductVariant;
use App\Services\ProductVariantService;

class ProductVariantController extends Controller
{
    public function __construct(protected ProductVariantService $service) {}


    public function store(ProductVariantRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Variant created successfully.');
    }


    public function update(ProductVariantRequest $request, ProductVariant $productVariant) {
        $this->service->update($productVariant, $request->validated());
        return back()->with('success', 'Variant updated successfully.');
    }


    public function destroy(ProductVariant $productVariant) {
        $this->service->delete($productVariant);
        return back()->with('success', 'Variant deleted successfully.');
    }


}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\BrandRequest;
use App\Models\Brand;
use App\Services\BrandService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function __construct(protected BrandService $service){}


    public function index(){
        return Inertia::render('Inventory/Brands/Index', [
            'brands' => $this->service->getAll(),
        ]);
    }



    public function store(BrandRequest $request){
        $this->service->create($request->validated());

        return back()->with(
            'success',
            'Brand created successfully.'
        );
    }

    public function update(BrandRequest $request, Brand $brand){
        $this->service->update(
            $brand,
            $request->validated()
        );

        return back()->with(
            'success',
            'Brand updated successfully.'
        );
    }

    public function destroy(Brand $brand){
        $this->service->delete($brand);

        return back()->with(
            'success',
            'Brand deleted successfully.'
        );
    }

    public function updateStatus(Request $request, Brand $brand){
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $this->service->updateStatus(
            $brand,
            $validated['status']
        );

        return back()->with(
            'success',
            'Brand status updated successfully.'
        );
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StockAdjustmentRequest;
use App\Http\Requests\Inventory\StockTransferRequest;
use App\Models\ProductStock;
use App\Services\ProductStockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductStockController extends Controller
{
    public function __construct(protected ProductStockService $service){}

  
    public function index(Request $request){
        return Inertia::render('Inventory/Stocks/Index', [
            'stocks' => $this->service->getAll(
                $request->only([
                    'product_id',
                    'warehouse_id'
                ])
            ),

            'products' => $this->service->getProducts(),

            'warehouses' => $this->service->getWarehouses(),
        ]);
    }

    public function adjust(StockAdjustmentRequest $request){
        $this->service->adjustStock(
            $request->validated(),
            $request->user()
        );

        return back()->with(
            'success',
            'Stock adjusted successfully.'
        );
    }


    public function transfer(StockTransferRequest $request){
        $this->service->transferStock(
            $request->validated(),
            $request->user()
        );

        return back()->with('success', 'Stock transferred successfully.');
    }


}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\StockMovementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function __construct(protected StockMovementService $service) {}

    public function index(Request $request) 
    {
        return Inertia::render('Inventory/StockMovements/Index', [
            'movements' => $this->service->getAll($request->only(['product_id', 'type'])),
            'products' => $this->service->getProducts(),
        ]);
    }
}
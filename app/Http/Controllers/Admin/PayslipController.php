<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PayslipService;
use Inertia\Inertia;
use Inertia\Response;

class PayslipController extends Controller
{
    public function __construct(protected PayslipService $service) {}

    public function index(): Response
    {
        return Inertia::render('Hrm/Payslips/Index', [
            'payslips' => $this->service->getAll(),
        ]);
    }

    public function show(int $id): Response
    {
        return Inertia::render('Hrm/Payslips/Show', [
            'payslip' => $this->service->getById($id),
        ]);
    }
}
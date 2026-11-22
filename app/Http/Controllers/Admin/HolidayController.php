<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\HolidayRequest;
use App\Models\Holiday;
use App\Services\HolidayService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function __construct(protected HolidayService $service) {}



    public function index() {
        return Inertia::render('Hrm/Holidays/Index', ['holidays' => $this->service->getAll()]);
    }


    public function store(HolidayRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Holiday created successfully.');
    }


    public function update(HolidayRequest $request, Holiday $holiday) {
        $this->service->update($holiday, $request->validated());
        return back()->with('success', 'Holiday updated successfully.');
    }


    public function destroy(Holiday $holiday) {
        $this->service->delete($holiday);
        return back()->with('success', 'Holiday deleted successfully.');
    }


    public function updateStatus(Request $request, Holiday $holiday) {
        $this->service->updateStatus($holiday, $request->status);
        return back()->with('success', 'Status updated successfully.');
    }

    
}
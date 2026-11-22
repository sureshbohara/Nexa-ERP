<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\CategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $service) {}

    public function index() {
        return Inertia::render('Inventory/Categories/Index', [
            'categories' => $this->service->getAll(),
            'parentOptions' => $this->service->getDropdownData()['categories'], 
        ]);
    }

    public function store(CategoryRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Category created successfully.');
    }

    public function update(CategoryRequest $request, Category $category) {
        $this->service->update($category, $request->validated());
        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category) {
        $this->service->delete($category);
        return back()->with('success', 'Category deleted successfully.');
    }

    public function updateStatus(Request $request, Category $category) {
        $request->validate(['status' => 'required|in:active,inactive']);
        $this->service->updateStatus($category, $request->status);
        return back()->with('success', 'Category status updated successfully.');
    }
}
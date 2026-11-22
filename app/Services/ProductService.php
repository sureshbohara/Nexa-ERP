<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use App\Repositories\ProductRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function __construct(protected ProductRepository $repository) {}

    public function getAll() {
        return $this->repository->getAll();
    }

    public function getDropdownData(): array
    {
        return [
            'categories' => Category::where('status', 'active')->get(['id', 'name']),
            'brands' => Brand::where('status', 'active')->get(['id', 'name']),
            'units' => Unit::where('status', 'active')->get(['id', 'name']),
        ];
    }

    public function create(array $data): Product
    {
        if (!isset($data['tax_rate']) || $data['tax_rate'] === '' || $data['tax_rate'] === null) {
            $data['tax_rate'] = 0;
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $data['image']->store('products', 'public');
        }
        
        return $this->repository->create($data);
    }

    public function update(Product $product, array $data): Product
    {
        if (array_key_exists('tax_rate', $data) && ($data['tax_rate'] === '' || $data['tax_rate'] === null)) {
            $data['tax_rate'] = 0;
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $data['image']->store('products', 'public');
        } else {
            unset($data['image']);
        }
        
        return $this->repository->update($product, $data);
    }

    public function delete(Product $product): bool {
        return $this->repository->delete($product);
    }

    public function updateStatus(Product $product, string $status): Product {
        return $this->repository->update($product, ['status' => $status]);
    }
}
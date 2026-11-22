<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;

class CategoryService
{
    public function __construct(protected CategoryRepository $repository) {}

    public function getAll() {
        return $this->repository->getAll();
    }

    public function getDropdownData(): array
    {
        return [
            'categories' => Category::where('status', 'active')
                                    ->orderBy('name')
                                    ->get(['id', 'name']),
        ];
    }

    public function create(array $data): Category {
        return $this->repository->create($data);
    }

    public function update(Category $category, array $data): Category {
        return $this->repository->update($category, $data);
    }

    public function delete(Category $category): bool {
        return $this->repository->delete($category);
    }

    public function updateStatus(Category $category, string $status): Category {
        return $this->repository->update($category, ['status' => $status]);
    }
}
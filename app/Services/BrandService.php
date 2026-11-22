<?php

namespace App\Services;

use App\Models\Brand;
use App\Repositories\BrandRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BrandService
{
    public function __construct(protected BrandRepository $repository) {}


    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): Brand
    {
        if (
            isset($data['logo']) &&
            $data['logo'] instanceof UploadedFile
        ) {
            $data['logo'] = $data['logo']->store(
                'brands',
                'public'
            );
        }

        return DB::transaction(function () use ($data) {
            return $this->repository->create($data);
        });
    }

    public function update(Brand $brand, array $data): Brand
    {
        $oldLogo = $brand->logo;

        if (
            isset($data['logo']) &&
            $data['logo'] instanceof UploadedFile
        ) {
            $data['logo'] = $data['logo']->store(
                'brands',
                'public'
            );

            if ($oldLogo) {
                Storage::disk('public')->delete($oldLogo);
            }
        } else {
            unset($data['logo']);
        }

        $this->repository->update($brand, $data);

        return $brand->refresh();
    }

    public function delete(Brand $brand): bool
    {
        return $this->repository->delete($brand);
    }

    public function updateStatus(
        Brand $brand,
        string $status
    ): Brand {
        return $this->repository->update($brand, [
            'status' => $status,
        ]);
    }
}

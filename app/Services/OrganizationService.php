<?php

namespace App\Services;

use App\Models\Organization;
use App\Repositories\OrganizationRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class OrganizationService
{
    public function __construct(protected OrganizationRepository $repository) {}

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): Organization
    {
        $data['logo'] = $this->handleLogoUpload($data['logo'] ?? null);
        return $this->repository->create($data);
    }

    public function update(Organization $organization, array $data): Organization
    {
        if (isset($data['logo']) && $data['logo'] instanceof UploadedFile) {
            $this->deleteLogo($organization);
            $data['logo'] = $this->handleLogoUpload($data['logo']);
        } else {
            unset($data['logo']); 
        }

        return $this->repository->update($organization, $data);
    }

    public function updateStatus(Organization $organization, string $status): Organization
    {
        return $this->repository->update($organization, ['status' => $status]);
    }

    public function delete(Organization $organization): bool
    {
        $this->deleteLogo($organization);
        return $this->repository->delete($organization);
    }

    private function handleLogoUpload(?UploadedFile $file): ?string
    {
        return $file?->store('organizations/logos', 'public');
    }

    private function deleteLogo(Organization $organization): void
    {
        if ($organization->logo) {
            Storage::disk('public')->delete($organization->logo);
        }
    }
}
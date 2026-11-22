<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use App\Models\Branch;
use App\Models\Organization;
use App\Repositories\UserRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UserService
{
    public function __construct(protected UserRepository $repository) {}


    public function getAll(?int $excludeUserId = null){
        return $this->repository->getAll($excludeUserId);
    }


    public function create(array $data): User
    {
        $data['image'] = $this->storeImage($data['image'] ?? null);
        return $this->repository->create($data);
    }


    public function update(User $user, array $data): User
    {
        if (($data['image'] ?? null) instanceof UploadedFile) {
            $this->deleteImage($user);
            $data['image'] = $this->storeImage($data['image']);
        } else {
            unset($data['image']);
        }

        return $this->repository->update($user, $data);
    }


    public function delete(User $user): bool
    {
        $this->deleteImage($user);
        return $this->repository->delete($user);
    }


    public function getDropdownData(): array
    {
        return [
            'roles' => Role::orderBy('name')->get(['id', 'name']),
            'organizations' => Organization::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'branches' => Branch::where('status', 'active')->orderBy('name')->get(['id', 'name', 'organization_id']),
        ];
    }


    private function storeImage(?UploadedFile $image): ?string
    {
        return $image?->store('users', 'public');
    }


    private function deleteImage(User $user): void
    {
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }
    }
    
}
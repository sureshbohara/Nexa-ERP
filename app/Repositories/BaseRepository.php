<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct()
    {
        $this->setModel();
    }

    abstract protected function setModel(): void;

    public function getModel(): Builder
    {
        return $this->model->newQuery();
    }

    public function all(array $relations = [])
    {
        return $this->getModel()
            ->with($relations)
            ->latest()
            ->get();
    }

    public function find(int $id, array $relations = []): ?Model
    {
        return $this->getModel()
            ->with($relations)
            ->find($id);
    }

    public function findOrFail(int $id, array $relations = []): Model
    {
        return $this->getModel()
            ->with($relations)
            ->findOrFail($id);
    }

    public function findBy(
        string $column,
        mixed $value,
        array $columns = ['*'],
        array $relations = []
    ): ?Model {
        return $this->getModel()
            ->with($relations)
            ->select($columns)
            ->where($column, $value)
            ->first();
    }

    public function create(array $data): Model
    {
        return $this->model->newQuery()->create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->fresh();
    }

    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }
}

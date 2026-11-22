<?php
namespace App\Repositories;
use App\Models\Holiday;
class HolidayRepository extends BaseRepository {

    protected function setModel(): void { $this->model = new Holiday(); }


    public function getAll(){
        return $this->model->latest('date')->get();
    }


}
<?php
namespace App\Http\Requests\Hrm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HolidayRequest extends FormRequest
{
    public function authorize(): bool { return true; }


    protected function prepareForValidation(): void {
        $this->merge(['organization_id' => $this->input('organization_id') ?? auth()->user()?->organization_id ?? \App\Models\Organization::value('id')]);
    }

    public function rules(): array {
        $holidayId = $this->route('holiday')?->id;
        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_recurring' => ['nullable', 'boolean'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
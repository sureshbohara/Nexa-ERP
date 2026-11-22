<?php
namespace App\Http\Requests\Hrm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LeaveTypeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void {
        $this->merge(['organization_id' => $this->input('organization_id') ?? auth()->user()?->organization_id ?? \App\Models\Organization::value('id')]);
    }

    public function rules(): array {
        $id = $this->route('leaveType')?->id;
        $orgId = $this->input('organization_id');
        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('leave_types', 'code')->ignore($id)->where('organization_id', $orgId)],
            'days_allowed' => ['required', 'integer', 'min:0'],
            'is_paid' => ['nullable', 'boolean'],
            'is_carried_forward' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
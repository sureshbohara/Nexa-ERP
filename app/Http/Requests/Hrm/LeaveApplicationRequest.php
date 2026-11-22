<?php
namespace App\Http\Requests\Hrm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LeaveApplicationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void {
        $this->merge(['organization_id' => $this->input('organization_id') ?? auth()->user()?->organization_id ?? \App\Models\Organization::value('id')]);
    }

    public function rules(): array {
        $orgId = $this->input('organization_id');
        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')],
            'employee_id' => ['required', Rule::exists('employees', 'id')->where('organization_id', $orgId)],
            'leave_type_id' => ['required', Rule::exists('leave_types', 'id')->where('organization_id', $orgId)],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:2000'],
            'status' => ['required', 'in:pending,approved,rejected,cancelled'],
        ];
    }
}
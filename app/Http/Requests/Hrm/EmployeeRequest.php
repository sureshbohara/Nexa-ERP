<?php
namespace App\Http\Requests\Hrm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $employeeId = $this->route('employee')?->id;

        return [
            'user_id' => ['required', 'exists:users,id'],
            'employee_code' => ['required', 'string', 'max:50', Rule::unique('employees', 'employee_code')->ignore($employeeId)],
            'department_id' => ['nullable', 'exists:departments,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'salary_structure_id' => ['nullable', 'exists:salary_structures,id'],
            'designation' => ['nullable', 'string', 'max:255'],
            'date_of_joining' => ['nullable', 'date'],
            'status' => ['required', 'in:active,inactive,terminated,resigned'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Please select a user for this employee.',
            'employee_code.required' => 'Employee code is required.',
            'employee_code.unique' => 'This employee code already exists.',
        ];
    }
}
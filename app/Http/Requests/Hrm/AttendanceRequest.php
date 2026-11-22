<?php

namespace App\Http\Requests\Hrm;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool 
    { 
        return true; 
    }

    protected function prepareForValidation(): void 
    {
        $this->merge([
            'organization_id' => $this->input('organization_id') ?? auth()->user()?->organization_id ?? \App\Models\Organization::value('id')
        ]);
    }

    public function rules(): array 
    {
        $id = $this->route('attendance')?->id;

        return [
            'organization_id' => ['nullable', Rule::exists('organizations', 'id')],
            'employee_id' => ['required', 'exists:employees,id'],
            'attendance_date' => [
                'required', 
                'date', 
                Rule::unique('attendances')->where('employee_id', $this->employee_id)->ignore($id)
            ],
            
            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i', 'after:check_in'],
            
            'status' => ['required', 'in:present,absent,late,leave,holiday,half_day'],
            'late_minutes' => ['nullable', 'integer', 'min:0'],
            'early_leave_minutes' => ['nullable', 'integer', 'min:0'],
            'overtime_minutes' => ['nullable', 'integer', 'min:0'],
            'working_hours' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'check_out.after' => 'Check Out time must be after Check In time.',
        ];
    }
}
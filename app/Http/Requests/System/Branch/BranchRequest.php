<?php
namespace App\Http\Requests\System\Branch;
use App\Models\Branch;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BranchRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }
    public function rules(): array {
        return [
            'organization_id' => ['required', Rule::exists('organizations', 'id')->whereNull('deleted_at')->where('status', 'active')],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50'],
            'branch_type' => ['required', Rule::in(['head_office', 'branch'])],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'alternate_phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'province' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'municipality' => ['nullable', 'string', 'max:150'],
            'ward_number' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:2000'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
    public function withValidator($validator): void {
        $validator->after(function ($validator) {
            $branch = $this->route('branch');
            if (!$branch instanceof Branch || $this->input('branch_type') !== 'head_office') return;
            if (Branch::where('organization_id', $this->input('organization_id'))->where('branch_type', 'head_office')->whereKeyNot($branch->id)->exists()) {
                $validator->errors()->add('branch_type', 'This organization already has a head office.');
            }
        });
    }
}
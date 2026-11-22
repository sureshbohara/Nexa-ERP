<?php

namespace App\Http\Requests\Saas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $attachmentId = $this->route('attachment')?->id;

        return [
            'name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'file' => $attachmentId
                ? 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,doc,docx,xls,xlsx,csv|max:10240'
                : 'required|file|mimes:pdf,jpg,jpeg,png,webp,doc,docx,xls,xlsx,csv|max:10240',

            'attachable_type' => [
                'nullable',
                'string',
                'max:150',
            ],

            'attachable_id' => [
                'nullable',
                'integer',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.mimes' => 'Supported formats: PDF, JPG, PNG, WEBP, DOC, XLS, CSV.',
            'file.max' => 'File size must not exceed 10MB.',
        ];
    }
}
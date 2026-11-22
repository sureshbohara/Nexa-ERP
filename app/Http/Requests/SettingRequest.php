<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            // General
            'app_name' => 'required|string|max:255',
            'language' => 'nullable|string|max:10',
            'default_currency' => 'required|string|max:10',
            'currency_position' => 'nullable|in:before,after',
            'decimal_places' => 'nullable|integer|min:0|max:4',
            'timezone' => 'required|string|max:100',
            'date_format' => 'required|string|in:Y-m-d,d-m-Y,m/d/Y',
            'financial_year_start' => 'required|string|max:10', 
            
            // Branding 
            'system_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'report_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'favicon' => 'nullable|image|mimes:png,ico|max:1024',
            
            // Inventory
            'enable_low_stock_alert' => 'nullable|boolean',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'allow_negative_stock' => 'nullable|boolean',
            'default_unit' => 'nullable|string|max:50',
            
            // Finance
            'invoice_prefix' => 'nullable|string|max:10',
            'default_tax_percentage' => 'nullable|numeric|min:0|max:100',
            'receipt_footer' => 'nullable|string|max:1000',
            
            // HRM
            'office_start_time' => 'nullable|string|max:10',
            'office_end_time' => 'nullable|string|max:10',
            'default_annual_leave' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'app_name.required' => 'Application name is required.',
            'financial_year_start.required' => 'Financial year start date is required.',
        ];
    }
}
<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SettingService
{
    public function getAllSettings(): array
    {
        $orgId = Auth::user()->role?->name === 'Super Admin' ? null : Auth::user()->organization_id; 
        $query = Setting::query();
        
        if ($orgId) {
            $query->where('organization_id', $orgId);
        } else {
            $query->whereNull('organization_id');
        }
        
        $settings = $query->pluck('value', 'key')->toArray();
        
        return [
            // General
            'app_name' => $settings['app_name'] ?? 'ERP SaaS',
            'language' => $settings['language'] ?? 'en',
            'default_currency' => $settings['default_currency'] ?? 'NPR',
            'currency_position' => $settings['currency_position'] ?? 'after',
            'decimal_places' => $settings['decimal_places'] ?? 2,
            'timezone' => $settings['timezone'] ?? 'Asia/Kathmandu',
            'date_format' => $settings['date_format'] ?? 'Y-m-d',
            'financial_year_start' => $settings['financial_year_start'] ?? '07-16',
            
            // Branding
            'system_logo' => $settings['system_logo'] ?? null,
            'report_logo' => $settings['report_logo'] ?? null,
            'favicon' => $settings['favicon'] ?? null,
            
            // Inventory
            'enable_low_stock_alert' => isset($settings['enable_low_stock_alert']) ? (bool) $settings['enable_low_stock_alert'] : true,
            'low_stock_threshold' => $settings['low_stock_threshold'] ?? 10,
            'allow_negative_stock' => isset($settings['allow_negative_stock']) ? (bool) $settings['allow_negative_stock'] : false,
            'default_unit' => $settings['default_unit'] ?? 'pcs',
            
            // Finance
            'invoice_prefix' => $settings['invoice_prefix'] ?? 'INV-',
            'default_tax_percentage' => $settings['default_tax_percentage'] ?? 13,
            'receipt_footer' => $settings['receipt_footer'] ?? 'Thank you for your business!',
            
            // HRM
            'office_start_time' => $settings['office_start_time'] ?? '09:00',
            'office_end_time' => $settings['office_end_time'] ?? '17:00',
            'default_annual_leave' => $settings['default_annual_leave'] ?? 15,
        ];
    }

    public function updateSettings(array $data): void
    {
        $orgId = Auth::user()->role?->name === 'Super Admin' ? null : Auth::user()->organization_id;
        
        
        $fileFields = ['system_logo', 'report_logo', 'favicon'];
        
        foreach ($fileFields as $field) {
            if (isset($data[$field]) && $data[$field] instanceof UploadedFile) {
                $oldSetting = Setting::where('key', $field)
                    ->where('organization_id', $orgId)
                    ->first();
                    
                if ($oldSetting && $oldSetting->value) {
                    Storage::disk('public')->delete($oldSetting->value);
                }
                
                $data[$field] = $data[$field]->store('settings/logos', 'public');
            } else {
                unset($data[$field]); 
            }
        }

        foreach ($data as $key => $value) {
            if ($value !== null && $value !== '') {
                Setting::updateOrCreate(
                    ['key' => $key, 'organization_id' => $orgId],
                    ['value' => $value]
                );
            }
        }
    }
}
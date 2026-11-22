<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $orgId = $user->organization_id;

        $query = AuditLog::with(['user:id,name,email', 'organization:id,name']);

        if ($orgId) {
            $query->where('organization_id', $orgId);
        }

        $logs = $query->latest()->take(200)->get()->map(function ($log) {
            return [
                'id' => $log->id,
                'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                'user_name' => $log->user ? "{$log->user->name} ({$log->user->email})" : 'System / Guest',
                'organization_name' => $log->organization?->name ?? 'Global',
                'event' => $log->event,
                'auditable_type' => class_basename($log->auditable_type),
                'auditable_id' => $log->auditable_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'ip_address' => $log->ip_address,
            ];
        });

        return Inertia::render('Saas/AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        return response()->json($auditLog);
    }
}
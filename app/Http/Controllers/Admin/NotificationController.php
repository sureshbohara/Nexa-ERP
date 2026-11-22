<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Saas\NotificationRequest;
use App\Models\Notification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
   
    private function visibleQuery(): Builder
    {
        $user = auth()->user();
        $orgId = $user?->organization_id;

        return Notification::query()->when(
            $orgId,
            fn (Builder $q) => $q->where(function (Builder $sub) use ($orgId) {
                $sub->whereNull('organization_id')->orWhere('organization_id', $orgId);
            }),
            fn (Builder $q) => $q->whereNull('organization_id')
        );
    }

    
    public function index(): Response
    {
        $notifications = $this->visibleQuery()
            ->latest('created_at')
            ->take(100)
            ->get()
            ->map(fn (Notification $n) => $this->transform($n))
            ->values();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $this->visibleQuery()->whereNull('read_at')->count(),
        ]);
    }

   
    public function recent(): JsonResponse
    {
        $notifications = $this->visibleQuery()
            ->latest('created_at')
            ->take(8)
            ->get()
            ->map(fn (Notification $n) => $this->transform($n))
            ->values();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $this->visibleQuery()->whereNull('read_at')->count(),
        ]);
    }

 
    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'count' => $this->visibleQuery()->whereNull('read_at')->count(),
        ]);
    }

    public function markAsRead(Notification $notification): mixed
    {
        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead(): mixed
    {
        $this->visibleQuery()->whereNull('read_at')->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }

    public function destroy(Notification $notification): mixed
    {
        $notification->delete();

        return back()->with('success', 'Notification deleted.');
    }

    public function create(): Response
    {
        return Inertia::render('Notifications/Create');
    }

    public function store(NotificationRequest $request): mixed
    {
        Notification::create($request->validated());

        return back()->with('success', 'Notification created successfully.');
    }

  
    private function transform(Notification $n): array
    {
        return [
            'id' => $n->id,
            'type' => $n->type,
            'title' => $n->title,
            'message' => $n->message,
            'priority' => $n->priority,
            'read_at' => $n->read_at,
            'is_read' => (bool) $n->read_at,
            'created_at' => $n->created_at?->diffForHumans(),
        ];
    }
}
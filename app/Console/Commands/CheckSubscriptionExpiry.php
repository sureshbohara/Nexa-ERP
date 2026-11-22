<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Subscription;
use Illuminate\Console\Command;

class CheckSubscriptionExpiry extends Command
{
    protected $signature = 'subscriptions:check-expiry';

    protected $description = 'Mark expired subscriptions and send renewal notifications';

    public function handle(): int
    {
        $expiredCount = 0;
        $notifiedCount = 0;

        $subscriptions = Subscription::withoutGlobalScopes()
            ->whereIn('status', ['active', 'trial'])
            ->with('organization', 'plan')
            ->get();

        foreach ($subscriptions as $subscription) {
            if ($subscription->is_expired) {
                $subscription->update(['status' => 'expired']);
                $expiredCount++;

                Notification::create([
                    'organization_id' => $subscription->organization_id,
                    'type' => 'subscription',
                    'title' => 'Subscription Expired',
                    'message' => 'Your ' . ($subscription->plan?->name ?? 'plan') . ' has expired. Please renew.',
                    'priority' => 'high',
                ]);

                continue;
            }

            if ($subscription->days_remaining <= 7) {
                Notification::create([
                    'organization_id' => $subscription->organization_id,
                    'type' => 'subscription',
                    'title' => 'Subscription Expiring Soon',
                    'message' => 'Your plan expires in ' . $subscription->days_remaining . ' days.',
                    'priority' => 'high',
                ]);

                $notifiedCount++;
            }
        }

        $this->info("Expired: {$expiredCount}, Renewal notices: {$notifiedCount}");

        return self::SUCCESS;
    }
}
<?php

namespace App\Traits;

use App\Observers\AuditableObserver;

trait Auditable
{
    protected static function bootAuditable()
    {
        static::observe(AuditableObserver::class);
    }
}
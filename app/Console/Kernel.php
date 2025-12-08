<?php

use Illuminate\Console\Scheduling\Schedule;

function schedule(Schedule $schedule): void
{
    // Example: Crawl events every hour
    $schedule->command('crawl:quick zilesinopti')->daily()->withoutOverlapping();
}
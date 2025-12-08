<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('crawl:quick {source}', function ($source) {
    $crawler = app(CrawlerManager::class);
    $events = $crawler->crawl($source);

    $this->info("Found {$events->count()} events from {$source}");

    // Save events to /tmp file
    $filePath = storage_path("/tmp/crawled_events_{$source}_" . time() . '.json');
    file_put_contents($filePath, $events->toJson(JSON_PRETTY_PRINT));
    $this->info("Events saved to {$filePath}");
})->purpose('Quickly crawl a specific source for events');

Artisan::command('events:count', function () {
    $this->info(Event::count() . ' events in the database.');
})->purpose('Count total events in the database');

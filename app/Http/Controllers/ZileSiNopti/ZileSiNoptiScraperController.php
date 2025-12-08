<?php

namespace App\Http\Controllers\ZileSiNopti;

use App\Http\Controllers\Controller;
use App\Observers\ZileSiNopti\ZileSiNoptiScraperObserver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Crawler\Crawler;

class ZileSiNoptiScraperController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        Log::info('ZileSiNoptiScraperController invoked');
        $url = "https://zilesinopti.ro/program-concerte-romania/?zi=2025-10-17";

        Crawler::create()
            ->setCrawlObserver(new ZileSiNoptiScraperObserver())
            ->setMaximumDepth(0)
            ->setTotalCrawlLimit(1)
            ->startCrawling($url);
    }
}

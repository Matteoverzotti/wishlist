<?php

use App\Http\Controllers\ZileSiNopti\ZileSiNoptiScraperController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    Log::info('Welcome page visited');
    return Inertia::render('Welcome', [
        'appName' => config('app.name'),
        'locations' => [
            ['id' => 1, 'name' => 'Old Town (Centrul Vechi)', 'lat' => 44.4268, 'lng' => 26.1025, 'description' => 'Historic center of Bucharest'],
            ['id' => 2, 'name' => 'Palace of Parliament', 'lat' => 44.4276, 'lng' => 26.0876, 'description' => 'World\'s largest administrative building'],
            ['id' => 3, 'name' => 'Herastrau Park', 'lat' => 44.4672, 'lng' => 26.0735, 'description' => 'Large park in northern Bucharest'],
            ['id' => 4, 'name' => 'Arcul de Triumf', 'lat' => 44.4669, 'lng' => 26.0786, 'description' => 'Triumphal arch monument'],
        ]
    ]);
});

Route::get('/crawl', ZileSiNoptiScraperController::class);

Route::get('/health', function () {
    $status = [];

    // Check Database Connection
    try {
        DB::connection()->getPdo();
        // Optionally, run a simple query
        DB::select('SELECT 1');
        $status['database'] = 'OK';
    } catch (\Exception $e) {
        $status['database'] = 'Error';
    }

    // Check Storage Access
    try {
        $testFile = 'health_check.txt';
        Storage::put($testFile, 'OK');
        $content = Storage::get($testFile);
        Storage::delete($testFile);

        if ($content === 'OK') {
            $status['storage'] = 'OK';
        } else {
            $status['storage'] = 'Error';
        }
    } catch (\Exception $e) {
        $status['storage'] = 'Error';
    }

    // Determine overall health status
    $isHealthy = collect($status)->every(function ($value) {
        return $value === 'OK';
    });

    $httpStatus = $isHealthy ? 200 : 503;

    return response()->json($status, $httpStatus);
});

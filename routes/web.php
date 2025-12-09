<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

// Wishlist Authentication Routes
Route::get('/', [AuthController::class, 'showAccessPage'])->name('wishlist.access');
Route::post('/access', [AuthController::class, 'verifyAccess'])->name('wishlist.verify');
Route::get('/select-user', [AuthController::class, 'showSelectUser'])->name('wishlist.selectUser');
Route::post('/select-user', [AuthController::class, 'selectUser'])->name('wishlist.selectUserPost');
Route::post('/create-user', [AuthController::class, 'createUser'])->name('wishlist.createUser');
Route::post('/logout', [AuthController::class, 'logout'])->name('wishlist.logout');

// Protected Wishlist Routes
Route::middleware([\App\Http\Middleware\CheckWishlistAuth::class])->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/items', [WishlistController::class, 'addItem'])->name('wishlist.addItem');
    Route::delete('/wishlist/items/{item}', [WishlistController::class, 'deleteItem'])->name('wishlist.deleteItem');
    Route::patch('/wishlist/items/{item}/status', [WishlistController::class, 'updateItemStatus'])->name('wishlist.updateStatus');
    Route::patch('/wishlist/items/{item}', [WishlistController::class, 'updateItem'])->name('wishlist.updateItem');
});

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

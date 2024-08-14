<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\{
    UserController,
    TransaksiController,
    FileTransaksiController,
    DashboardController,
};

// Rute login dan logout tidak memerlukan token
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Rute yang memerlukan token
Route::middleware('api.token')->group(function () {
    Route::apiResources([
        'users' => UserController::class,
        'transaksi' => TransaksiController::class,
        'file-transaksi' => FileTransaksiController::class,
    ]);

    Route::get('/count-user-by-role', [DashboardController::class, 'getCountByRole']);
    Route::get('/top-penjoki', [DashboardController::class, 'topPenjoki']);
    Route::get('/tes', [DashboardController::class, 'index']);
});

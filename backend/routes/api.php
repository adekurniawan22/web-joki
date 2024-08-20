<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\{
    UserController,
    TransaksiController,
    FileTransaksiController,
    DashboardController,
    FileTransaksiSelesaiController
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
        'file-transaksi-selesai' => FileTransaksiSelesaiController::class,
    ]);

    // Dashboard
    Route::get('/jumlah-user-by-role', [DashboardController::class, 'getCountByRole']);
    Route::get('/top-penjoki/{limit}', [DashboardController::class, 'topPenjoki'])
        ->where('limit', '[0-9]+');
    Route::get('/jumlah-transaksi-perbulan/{id_penjoki}', [DashboardController::class, 'getMonthlyTransactionSummary']);
    Route::get('/jumlah-transaksi-perbulan', [DashboardController::class, 'getMonthlyTransactionSummary']);
    Route::get('/jumlah-gaji-perbulan/{id_penjoki}', [DashboardController::class, 'getMonthlySalarySummary']);
    Route::get('/jumlah-transaksi-by-status', [DashboardController::class, 'getCountTransactionByStatus']);
    Route::get('/jumlah-transaksi-by-status/{id_penjoki}', [DashboardController::class, 'getCountTransactionByStatusPenjoki']);

    // Riwayat Transaksi
    Route::get('/transaksi/riwayat/{id}', [TransaksiController::class, 'riwayatTransaksi']);
    Route::put('/transaksi/ambil/{id}', [TransaksiController::class, 'ambilJoki']);

    // Leaderboard
    Route::get('/top-penjoki', [DashboardController::class, 'topPenjoki']);

    // PDF
    Route::get('/export-monthly-summary', [DashboardController::class, 'exportMonthlyTransactionSummary']);
    Route::get('/export-monthly-summary/{id_penjoki}', [DashboardController::class, 'exportMonthlyTransactionSummary']);
    Route::get('/export-monthly-salary-summary/{id_penjoki}', [DashboardController::class, 'exportgetMonthlySalarySummary']);
});

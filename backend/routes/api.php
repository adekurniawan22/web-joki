<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\FileTransaksiController;
use App\Http\Controllers\Api\DashboardController;

Route::apiResources([
    'users' => UserController::class,
    'transaksi' => TransaksiController::class,
    'file-transaksi' => FileTransaksiController::class,
]);


Route::get('/count-user-by-role', [DashboardController::class, 'getCountByRole']);
Route::get('/top-penjoki', [DashboardController::class, 'topPenjoki']);
Route::get('/tes', [DashboardController::class, 'index']);

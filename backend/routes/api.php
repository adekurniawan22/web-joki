<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\FileTransaksiController;

Route::apiResources([
    'users' => UserController::class,
    'transaksi' => TransaksiController::class,
    'file-transaksi' => FileTransaksiController::class,
]);

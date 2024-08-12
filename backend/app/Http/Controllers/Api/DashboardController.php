<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getCountByRole()
    {
        // Menghitung jumlah pengguna berdasarkan role menggunakan model User
        $ownerCount = User::countByRole('owner');
        $adminCount = User::countByRole('admin');
        $penjokiCount = User::countByRole('penjoki');

        // Mengembalikan data dalam format JSON
        return response()->json([
            'owner' => $ownerCount,
            'admin' => $adminCount,
            'penjoki' => $penjokiCount
        ]);
    }

    public function topPenjoki()
    {
        // Mendapatkan 3 penjoki teratas berdasarkan jumlah transaksi selesai
        $topPenjoki = Transaksi::topPenjoki(3);

        // Mengembalikan data dalam format JSON
        return response()->json([
            'top_penjoki' => $topPenjoki
        ]);
    }

    public function index()
    {
        // Mendapatkan tahun saat ini
        $tahun = now()->year;

        // Query untuk menghitung jumlah transaksi selesai setiap bulan dalam tahun ini
        $transaksiPerBulan = Transaksi::selectRaw('MONTH(tgl_terima) as bulan, COUNT(*) as jumlah')
            ->whereYear('tgl_terima', $tahun)
            ->where('status', 'selesai')
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get()
            ->keyBy('bulan');

        // Siapkan data untuk view
        $bulanData = [];
        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $bulanData[$bulan] = $transaksiPerBulan->get($bulan)->jumlah ?? 0;
        }

        return response()->json([
            'tahun' => $tahun,
            'data' => $bulanData
        ]);
    }
}

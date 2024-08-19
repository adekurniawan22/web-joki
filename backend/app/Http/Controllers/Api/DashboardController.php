<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;


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

    // DashboardController.php

    public function topPenjoki($limit = null)
    {
        // Validasi parameter $limit jika diperlukan
        $limit = is_numeric($limit) ? (int) $limit : null;

        // Mendapatkan penjoki teratas berdasarkan jumlah transaksi selesai
        $topPenjoki = Transaksi::topPenjoki($limit);

        // Mengembalikan data dalam format JSON
        return response()->json([
            'top_penjoki' => $topPenjoki
        ]);
    }


    public function getMonthlyTransactionSummary($id_penjoki = null)
    {
        // Mendapatkan tahun saat ini
        $tahun = now()->year;

        // Query untuk menghitung jumlah transaksi selesai setiap bulan dalam tahun ini
        $query = Transaksi::selectRaw('MONTH(tgl_terima) as bulan, COUNT(*) as jumlah')
            ->whereYear('tgl_terima', $tahun)
            ->where('status', 'selesai')
            ->groupBy('bulan')
            ->orderBy('bulan');

        // Tambahkan kondisi where jika $id_penjoki diberikan
        if ($id_penjoki) {
            $query->where('take_by', $id_penjoki);
        }

        // Eksekusi query dan ambil data
        $transaksiPerBulan = $query->get()->keyBy('bulan');

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


    public function exportMonthlyTransactionSummary($id_penjoki = null)
    {
        // Mendapatkan tahun saat ini
        $tahun = now()->year;

        $query = Transaksi::selectRaw('MONTH(tgl_terima) as bulan, COUNT(*) as jumlah')
            ->whereYear('tgl_terima', $tahun)
            ->where('status', 'selesai')
            ->groupBy('bulan')
            ->orderBy('bulan');

        // Tambahkan kondisi where jika $id_penjoki diberikan
        if ($id_penjoki) {
            $query->where('take_by', $id_penjoki);
        }

        // Eksekusi query dan ambil data
        $transaksiPerBulan = $query->get()->keyBy('bulan');

        // Siapkan data untuk view
        $bulanData = [];
        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $bulanData[$bulan] = $transaksiPerBulan->get($bulan)->jumlah ?? 0;
        }

        // Data untuk dikirim ke view
        $data = [
            'tahun' => $tahun,
            'bulanData' => $bulanData,
        ];

        // Menghasilkan PDF
        $pdf = PDF::loadView('pdf.monthly_summary', $data);

        // Mengunduh PDF
        return $pdf->download('monthly_transaction_summary_' . $tahun . '.pdf');
    }

    public function getMonthlySalarySummary($id_penjoki)
    {
        // Mendapatkan tahun saat ini
        $tahun = now()->year;

        // Query untuk menghitung total harga transaksi selesai setiap bulan dalam tahun ini
        $transaksiPerBulan = Transaksi::selectRaw('MONTH(tgl_terima) as bulan, SUM(harga) * 0.5 as total_harga')
            ->whereYear('tgl_terima', $tahun)
            ->where('status', 'selesai')
            ->where('take_by', $id_penjoki)
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get()
            ->keyBy('bulan');


        // Siapkan data untuk view
        $bulanData = [];
        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $bulanData[$bulan] = $transaksiPerBulan->get($bulan)->total_harga ?? 0;
        }

        return response()->json([
            'tahun' => $tahun,
            'data' => $bulanData
        ]);
    }

    public function exportgetMonthlySalarySummary($id_penjoki)
    {
        // Mendapatkan tahun saat ini
        $tahun = now()->year;

        // Query untuk menghitung total harga transaksi selesai setiap bulan dalam tahun ini
        $transaksiPerBulan = Transaksi::selectRaw('MONTH(tgl_terima) as bulan, SUM(harga) * 0.5 as total_harga')
            ->whereYear('tgl_terima', $tahun)
            ->where('status', 'selesai')
            ->where('take_by', $id_penjoki)
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get()
            ->keyBy('bulan');

        // Siapkan data untuk view
        $bulanData = [];
        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $bulanData[$bulan] = $transaksiPerBulan->get($bulan)->total_harga ?? 0;
        }

        // Data untuk dikirim ke view
        $data = [
            'nama' => User::findOrFail($id_penjoki)->nama,
            'tahun' => $tahun,
            'bulanData' => $bulanData,
        ];

        // Menghasilkan PDF
        $pdf = PDF::loadView('pdf.monthly_salary_summary', $data);

        // Mengunduh PDF
        return $pdf->download('monthly_salary_summary_' . $tahun . '.pdf');
    }

    public function getCountTransactionByStatus()
    {
        // Menghitung jumlah transaksi berdasarkan status
        $pending = Transaksi::where('status', 'pending')->count();
        $dikerjakan = Transaksi::where('status', 'dikerjakan')->count();
        $selesai = Transaksi::where('status', 'selesai')->count();

        // Mengembalikan data dalam format JSON
        return response()->json([
            'pending' => $pending,
            'dikerjakan' => $dikerjakan,
            'selesai' => $selesai,
        ]);
    }
}

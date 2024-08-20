<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksi = Transaksi::with(['creator:id,nama', 'taker:id,nama', 'files', 'files_selesai'])->get();
        return response()->json($transaksi, 200);
    }

    public function show($id)
    {
        $transaksi = Transaksi::with(['creator:id,nama', 'taker:id,nama', 'files', 'files_selesai'])->find($id);
        if ($transaksi) {
            return response()->json($transaksi, 200);
        }
        return response()->json(['message' => 'Transaction not found'], 404);
    }

    public function store(Request $request)
    {
        // Validasi input untuk transaksi
        $validator = Validator::make($request->all(), [
            'tipe' => 'required|string|in:Joki Tugas,Joki Game',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tgl_terima' => 'required|date',
            'tgl_selesai' => 'nullable|date',
            'status' => 'required|string|in:pending,dikerjakan,selesai',
            'harga' => 'required|integer',
            'created_by' => 'required|exists:user,id',
            'take_by' => 'nullable|exists:user,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Simpan transaksi
        $transaksi = Transaksi::create([
            'tipe' => $request->tipe,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tgl_terima' => $request->tgl_terima,
            'tgl_selesai' => $request->tgl_selesai,
            'status' => $request->status,
            'harga' => $request->harga,
            'created_by' => $request->created_by,
            'take_by' => $request->take_by ?? null,
        ]);

        // Return response
        return response()->json([
            'message' => 'Transaction created successfully',
            'data' => $transaksi,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Validasi input untuk transaksi
        $validator = Validator::make($request->all(), [
            'tipe' => 'required|string|in:Joki Tugas,Joki Game',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tgl_terima' => 'required|date',
            'tgl_selesai' => 'nullable|date',
            'status' => 'required|string|in:pending,dikerjakan,selesai',
            'harga' => 'required|integer',
            'take_by' => 'nullable|exists:user,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Temukan transaksi
        $transaksi = Transaksi::findOrFail($id);

        // Update transaksi
        $transaksi->update([
            'tipe' => $request->tipe,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tgl_terima' => $request->tgl_terima,
            'tgl_selesai' => $request->tgl_selesai,
            'status' => $request->status,
            'harga' => $request->harga,
            'take_by' => $request->take_by ?? null,
        ]);

        // Return response
        return response()->json([
            'message' => 'Transaction updated successfully',
            'data' => $transaksi,
        ], 200);
    }

    public function destroy($id)
    {
        $transaksi = Transaksi::with(['creator:id,nama', 'taker:id,nama', 'files', 'files_selesai'])->find($id);
        if ($transaksi) {

            // Delete associated FileTransaksi records
            foreach ($transaksi->files as $fileTransaksi) {
                // Delete the file from storage
                Storage::disk('public')->delete($fileTransaksi->file);
                // Delete the FileTransaksi record
                $fileTransaksi->delete();
            }

            foreach ($transaksi->files_selesai as $fileTransaksi) {
                // Delete the file from storage
                Storage::disk('public')->delete($fileTransaksi->file);
                // Delete the FileTransaksi record
                $fileTransaksi->delete();
            }

            $transaksi->delete();
            return response()->json([
                'message' => 'Transaction deleted successfully',
                'data' => $transaksi
            ], 200);
        }
        return response()->json(['message' => 'Transaction not found'], 404);
    }


    public function ambilJoki(Request $request, $id)
    {
        // Validasi input untuk transaksi
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,dikerjakan,selesai',
            'take_by' => 'nullable|exists:user,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Temukan transaksi
        $transaksi = Transaksi::findOrFail($id);

        // Update transaksi
        $transaksi->update([
            'status' => $request->status,
            'take_by' => $request->take_by ?? null,
            'tgl_selesai' => $request->tgl_selesai ?? null,
        ]);

        // Return response
        return response()->json([
            'message' => 'Transaction take successfully',
            'data' => $transaksi,
        ], 200);
    }


    public function riwayatTransaksi($id_penjoki)
    {
        // Mendapatkan transaksi berdasarkan id_penjoki dan mengurutkannya berdasarkan id dalam urutan menurun
        $transaksi = Transaksi::with(['creator:id,nama', 'taker:id,nama', 'files'])
            ->whereIn('status', ['selesai', 'dikerjakan']) // Menambahkan kondisi where untuk memfilter berdasarkan id_penjoki
            ->where('take_by', $id_penjoki) // Menambahkan kondisi where untuk memfilter berdasarkan id_penjoki
            ->orderBy('id', 'desc') // Mengurutkan hasil berdasarkan kolom id dalam urutan menurun
            ->get();

        return response()->json($transaksi, 200);
    }
}

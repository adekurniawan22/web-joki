<?php

namespace App\Http\Controllers\Api;

use App\Models\FileTransaksi;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class FileTransaksiController extends Controller
{
    public function index()
    {
        $files = FileTransaksi::all();
        return response()->json($files);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_transaksi' => 'required|exists:transaksi,id',
            'keterangan' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('file');
        $filePath = $file->store('file_transaksi', 'public');

        $fileTransaksi = FileTransaksi::create([
            'id_transaksi' => $request->id_transaksi,
            'keterangan' => $request->keterangan,
            'file' => $filePath,
        ]);

        return response()->json([
            'message' => 'File transaction created successfully',
            'data' => $fileTransaksi
        ], 201);
    }

    public function show($id)
    {
        $fileTransaksi = FileTransaksi::find($id);

        if (!$fileTransaksi) {
            return response()->json([
                'message' => 'File transaction not found'
            ], 404);
        }

        return response()->json($fileTransaksi);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'keterangan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $fileTransaksi = FileTransaksi::find($id);

        if (!$fileTransaksi) {
            return response()->json([
                'message' => 'File transaction not found'
            ], 404);
        }

        $fileTransaksi->keterangan = $request->input('keterangan');
        $fileTransaksi->save();

        return response()->json([
            'message' => 'File transaction updated successfully',
            'data' => $fileTransaksi
        ], 200);
    }

    public function destroy($id)
    {
        $fileTransaksi = FileTransaksi::find($id);

        if (!$fileTransaksi) {
            return response()->json([
                'message' => 'File transaction not found'
            ], 404);
        }

        // Delete the file from storage
        Storage::disk('public')->delete($fileTransaksi->file);

        $fileTransaksi->delete();

        return response()->json([
            'message' => 'File transaction deleted successfully',
            'data' => $fileTransaksi
        ]);
    }
}

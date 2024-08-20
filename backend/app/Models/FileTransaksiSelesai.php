<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileTransaksiSelesai extends Model
{
    protected $table = 'file_transaksi_selesai';

    protected $fillable = [
        'id_transaksi',
        'keterangan',
        'file',
    ];

    // Relasi dengan transaksi
    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id', 'id_transaksi');
    }
}
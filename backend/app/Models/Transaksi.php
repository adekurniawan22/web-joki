<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    // Nama tabel yang digunakan oleh model ini
    protected $table = 'transaksi';

    // Kolom-kolom yang dapat diisi secara massal
    protected $fillable = [
        'tipe', 'judul', 'deskripsi', 'tgl_terima', 'tgl_selesai', 'status', 'harga', 'created_by', 'take_by',
    ];

    // Mendefinisikan tipe data kolom yang perlu di-cast
    protected $casts = [
        'tgl_terima' => 'datetime',
        'tgl_selesai' => 'datetime',
    ];

    // Relasi dengan User sebagai creator
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    // Relasi dengan User sebagai taker
    public function taker()
    {
        return $this->belongsTo(User::class, 'take_by', 'id');
    }

    // Relasi dengan FileTransaksi
    public function files()
    {
        return $this->hasMany(FileTransaksi::class, 'id_transaksi', 'id')->select(['id', 'id_transaksi', 'keterangan', 'file']);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Transaksi extends Model
{
    // Nama tabel yang digunakan oleh model ini
    protected $table = 'transaksi';

    // Kolom-kolom yang dapat diisi secara massal
    protected $fillable = [
        'tipe',
        'judul',
        'deskripsi',
        'tgl_terima',
        'tgl_selesai',
        'status',
        'harga',
        'created_by',
        'take_by',
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

    public static function topPenjoki($limit = null)
    {
        $query = DB::table('user')
            ->select('user.id', 'user.nama', 'user.email', DB::raw('COALESCE(COUNT(transaksi.id), 0) as transaksi_count'))
            ->leftJoin('transaksi', 'user.id', '=', 'transaksi.take_by')
            ->where('user.role', 'penjoki')
            ->where(function ($query) {
                $query->where('transaksi.status', 'selesai')
                    ->orWhereNull('transaksi.status');
            })
            ->groupBy('user.id', 'user.nama', 'user.email')
            ->orderBy('transaksi_count', 'desc');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }
}

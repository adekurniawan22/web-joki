<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'user';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'no_hp',
        'alamat',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    // Relasi dengan transaksi
    public function createdTransaksi()
    {
        return $this->hasMany(Transaksi::class, 'created_by');
    }

    public function takenTransaksi()
    {
        return $this->hasMany(Transaksi::class, 'take_by');
    }

    // Fungsi untuk menghitung jumlah pengguna berdasarkan role
    public static function countByRole($role)
    {
        return self::where('role', $role)->count();
    }
}

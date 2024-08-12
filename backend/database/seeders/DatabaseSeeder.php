<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            TransaksiSeeder::class,
            FileTransaksiSeeder::class,
        ]);
    }
}

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');

        // Define the number of users for each role
        $ownerCount = 2;
        $adminCount = 3;
        $totalUsers = 10;
        $penjokiCount = $totalUsers - ($ownerCount + $adminCount);

        // Create users with roles
        $roles = array_merge(
            array_fill(0, $ownerCount, 'owner'),
            array_fill(0, $adminCount, 'admin'),
            array_fill(0, $penjokiCount, 'penjoki')
        );

        // Shuffle roles to ensure random distribution
        shuffle($roles);

        foreach ($roles as $index => $role) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $name = $firstName . ' ' . $lastName;

            DB::table('user')->insert([
                'nama' => $name,
                'email' => $this->generateEmailFromName($name),
                'password' => bcrypt('password'),
                'no_hp' => $this->generatePhoneNumber(),
                'alamat' => $faker->address,
                'role' => $role,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function generateEmailFromName($name)
    {
        $name = strtolower(str_replace(' ', '.', $name));
        return $name . '@example.com';
    }

    private function generatePhoneNumber()
    {
        // Generate 10 random digits
        $randomDigits = rand(1000000000, 9999999999);
        // Prefix with '08'
        return '08' . $randomDigits;
    }
}

class TransaksiSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');

        // Define the number of transactions for each status
        $pendingCount = 10;
        $dikerjakanCount = 5;
        $selesaiCount = 50;

        // Create transactions with statuses
        $statuses = array_merge(
            array_fill(0, $pendingCount, 'pending'),
            array_fill(0, $dikerjakanCount, 'dikerjakan'),
            array_fill(0, $selesaiCount, 'selesai')
        );

        // Shuffle statuses to ensure random distribution
        shuffle($statuses);

        // Get user IDs for 'admin' and 'penjoki' roles
        $adminIds = DB::table('user')->where('role', 'admin')->pluck('id')->toArray();
        $penjokiIds = DB::table('user')->where('role', 'penjoki')->pluck('id')->toArray();

        foreach ($statuses as $index => $status) {
            $createdBy = $faker->randomElement($adminIds);
            $takeBy = $status === 'selesai' ? $faker->randomElement($penjokiIds) : null;

            // Generate harga dalam kelipatan 500
            $minPrice = 50000; // Harga minimum
            $maxPrice = 500000; // Harga maksimum
            $harga = $faker->numberBetween($minPrice / 500, $maxPrice / 500) * 500;

            // Generate tgl_terima and tgl_selesai
            $tglTerima = $faker->dateTimeThisYear();
            $tglSelesai = $status === 'selesai' ? (clone $tglTerima)->modify('+1 week') : null;

            DB::table('transaksi')->insert([
                'tipe' => $faker->randomElement(['Joki Tugas', 'Joki Game']),
                'judul' => $faker->sentence,
                'deskripsi' => $faker->paragraph,
                'tgl_terima' => $tglTerima->format('Y-m-d H:i:s'),
                'tgl_selesai' => $tglSelesai ? $tglSelesai->format('Y-m-d H:i:s') : null,
                'status' => $status,
                'harga' => $harga,
                'created_by' => $createdBy,
                'take_by' => $takeBy,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}


class FileTransaksiSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');

        // Ambil ID transaksi yang ada dari tabel transaksi
        $transaksiIds = DB::table('transaksi')->pluck('id')->toArray();

        foreach (range(1, 30) as $index) {
            DB::table('file_transaksi')->insert([
                'id_transaksi' => $faker->randomElement($transaksiIds),
                'keterangan' => $faker->sentence,
                'file' => $faker->word . '.pdf',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

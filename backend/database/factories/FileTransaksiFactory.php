<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FileTransaksiFactory extends Factory
{
    protected $faker;

    public function __construct()
    {
        parent::__construct();
        $this->faker = \Faker\Factory::create('id_ID');  // Set locale to Indonesian
    }

    public function definition()
    {
        return [
            'id_transaksi' => \App\Models\Transaksi::factory(), // Generate transaksi id dynamically
            'keterangan' => $this->faker->sentence,
            'file' => $this->faker->word . '.pdf',
        ];
    }
}

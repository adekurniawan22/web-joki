<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TransaksiFactory extends Factory
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
            'tipe' => $this->faker->randomElement(['Joki Tugas', 'Joki Game']),
            'judul' => $this->faker->sentence,
            'deskripsi' => $this->faker->paragraph,
            'tgl_terima' => $this->faker->dateTimeThisMonth(),
            'tgl_selesai' => $this->faker->optional()->dateTimeBetween('now', '+1 week'),
            'status' => $this->faker->randomElement(['pending', 'dikerjakan', 'selesai']),
            'harga' => $this->faker->numberBetween(100000, 1000000),
            'created_by' => \App\Models\User::factory(),  // Generate user id dynamically
            'take_by' => \App\Models\User::factory(),     // Generate user id dynamically
        ];
    }
}

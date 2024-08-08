<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = \App\Models\User::class; // Menetapkan model yang digunakan

    public function definition()
    {
        // Mengatur locale 'id_ID' untuk Faker secara default
        $this->faker->locale = 'id_ID';

        $name = $this->faker->name;

        return [
            'nama' => $name,
            'email' => strtolower(str_replace(' ', '.', $name)) . '@example.com', // Generate email based on name
            'password' => Hash::make('password'), // Encrypt password
            'no_hp' => $this->faker->phoneNumber,
            'alamat' => $this->faker->address,
            'role' => $this->faker->randomElement(['owner', 'admin', 'penjoki']),
        ];
    }
}

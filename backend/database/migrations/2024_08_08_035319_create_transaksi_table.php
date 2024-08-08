<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransaksiTable extends Migration
{
    public function up()
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->string('tipe');
            $table->string('judul');
            $table->text('deskripsi');
            $table->dateTime('tgl_terima');
            $table->dateTime('tgl_selesai')->nullable();
            $table->enum('status', ['pending', 'dikerjakan', 'selesai']);
            $table->bigInteger('harga');
            $table->foreignId('created_by')->constrained('user');
            $table->foreignId('take_by')->nullable()->constrained('user');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transaksi');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gps_cache', function (Blueprint $table) {
            $table->id();
            $table->string('lat');
            $table->string('lon');
            $table->text('gps_location');
            $table->timestamps();
            $table->unique(['lat', 'lon']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gps_cache');
    }
};

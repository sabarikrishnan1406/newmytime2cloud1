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
        Schema::create('a_i_triggers', function (Blueprint $table) {
            $table->id();

            $table->string('type'); // absent, late, early_leave, present
            $table->integer('days');

            $table->time('run_time');

            $table->string('frequency')->default('daily'); // daily, weekly, monthly

            $table->string('weekdays')->nullable(); // Mon,Tue
            $table->integer('month_day')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('a_i_triggers');
    }
};

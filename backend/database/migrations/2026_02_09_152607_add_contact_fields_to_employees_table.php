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
        Schema::table('employees', function (Blueprint $table) {
            $table->json('contact')->nullable();
            $table->json('present_address')->nullable();
            $table->json('permanent_address')->nullable();
            $table->json('primary_contact')->nullable();
            $table->json('secondary_contact')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'contact',
                'present_address',
                'permanent_address',
                'primary_contact',
                'secondary_contact',
            ]);
        });
    }
};

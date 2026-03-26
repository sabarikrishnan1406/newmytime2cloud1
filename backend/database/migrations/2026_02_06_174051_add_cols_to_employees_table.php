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
            // Authentication fields
            $table->string('email')->nullable();
            $table->string('password')->nullable();

            // Personal Details
            $table->string('nationality')->nullable();
            $table->string('date_of_birth')->nullable();
            $table->string('gender')->nullable();

            // Health & Identity
            $table->string('religion')->nullable();
            $table->string('blood_group', 5)->nullable(); // e.g., A+, O-
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
            $table->dropColumn(['email', 'password', 'nationality', 'date_of_birth', 'gender', 'religion', 'blood_group']);
        });
    }
};

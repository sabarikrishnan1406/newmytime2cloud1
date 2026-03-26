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
        Schema::table('shifts', function (Blueprint $table) {
            $table->boolean("is_auto_deduct")->default(false);
            $table->string("break_duration")->default("01:00");
            $table->boolean("unlimited_for_multi")->default(false);
            $table->string("minimum_session_duration")->default("00:30");

            $table->string("first_session_name")->default("Morning");
            $table->string("second_session_name")->default("Afternoon");

            $table->json("weekoff_rules")->nullable();
            $table->json("halfday_rules")->nullable();

            $table->boolean("weekend_allowed_ot")->default(false);
            $table->boolean("holiday_allowed_ot")->default(false);
            $table->string("daily_ot_allowed_mins")->default("03:00");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropColumn([
                'is_auto_deduct',
                'break_duration',
                'unlimited_for_multi',
                'minimum_session_duration',
                'first_session_name',
                'second_session_name',
                'weekoff_rules',
                'halfday_rules',
                'weekend_allowed_ot',
                'holiday_allowed_ot',
                'daily_ot_allowed_mins',
            ]);
        });
    }
};

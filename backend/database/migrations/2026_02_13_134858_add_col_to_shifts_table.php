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
            $table->string("significant_attendanc_rule_late_coming")->default("No Action");
            $table->string("significant_attendanc_rule_early_going")->default("No Action");
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
            $table->dropColumn("significant_attendanc_rule_late_coming");
            $table->dropColumn("significant_attendanc_rule_early_going");
        });
    }
};

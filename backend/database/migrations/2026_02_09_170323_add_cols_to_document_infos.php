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
        Schema::table('document_infos', function (Blueprint $table) {
            $table->string('type')->nullable();
            $table->string('issue_date')->nullable();
            $table->string('expiry_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('document_infos', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'issue_date',
                'expiry_date',
            ]);
        });
    }
};

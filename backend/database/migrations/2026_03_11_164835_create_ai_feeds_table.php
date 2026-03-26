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
        Schema::create('ai_feeds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('type');
            $table->text('description')->nullable();
            $table->json('data')->nullable();
            $table->timestamps();

            $table->index('company_id');
            // Unique index to prevent duplicate feeds for same company, type, and dates
            $table->unique([ 'company_id', 'type', 'description' ], 'ai_feeds_unique_main');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ai_feeds');
    }
};

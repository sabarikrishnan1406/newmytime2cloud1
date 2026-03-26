<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Don't forget to import DB

return new class extends Migration
{
    public function up()
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->string('description')->nullable();
        });

        // 1. Remove the old string default value
        DB::statement('ALTER TABLE departments ALTER COLUMN company_id DROP DEFAULT');

        // 2. Change the type with the cast
        DB::statement('ALTER TABLE departments ALTER COLUMN company_id TYPE INTEGER USING company_id::integer');

        // 3. (Optional) Set a new integer default, e.g., 0 or leave it nullable
        // DB::statement('ALTER TABLE departments ALTER COLUMN company_id SET DEFAULT 0');
    }

    public function down()
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        // Reverse: Drop int default, change back to varchar
        DB::statement('ALTER TABLE departments ALTER COLUMN company_id DROP DEFAULT');
        DB::statement('ALTER TABLE departments ALTER COLUMN company_id TYPE VARCHAR(255) USING company_id::varchar');
    }
};

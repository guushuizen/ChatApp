<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveHousenumberFromUserinfo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_infos', function(Blueprint $table) {
            $table->dropColumn('house_number');
            $table->renameColumn('street', 'street_address');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_infos', function(Blueprint $table) {
            $table->integer('house_number')->default(0);
            $table->renameColumn('street_address', 'street');
        });
    }
}

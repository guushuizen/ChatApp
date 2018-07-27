<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFileToMessages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('chat_messages', function(Blueprint $table) {
            $table->string('file_url')->after('chatroom_id');
            $table->string('file_name')->after('file_url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('chat_messages', function(Blueprint $table) {
            $table->dropColumn('file_url');
            $table->dropColumn('file_name');
        });
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    /**
     *  Mass-assignable field
     */

    protected $fillable = ['username', 'user_id', 'message', 'chatroom_id', 'file_url', 'file_name'];

    /**
     *  One To Many (Inverse) Relationship between ChatMessage and User
     */

    public function user() {
        $this->belongsTo('App\User');
    }

    /**
     * One To Many (Inverse) Relationship between ChatMessage and ChatRoom
     */

    public function chatroom() {
        $this->belongsTo('App\ChatRoom');
    }
}

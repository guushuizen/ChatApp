<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    /**
     *  Mass-assignable field
     */

    protected $fillable = ['username', 'user_id', 'message', 'room'];

    /**
     *  One To Many (Inverse) Relationship between ChatMessage and User
     */

    public function user() {
        $this->belongsTo('App\User');
    }
}

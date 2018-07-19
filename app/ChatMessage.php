<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    /**
     *  Mass-assignable field
     */

    protected $fillable = ['username', 'message'];
}

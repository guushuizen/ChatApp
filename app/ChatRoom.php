<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{

    /**
     * Mass-assignable fields
     *
     * @var array
     */
    protected $fillable = ['name'];


    /**
     * MySQL Database table name for this model.
     *
     * @var string
     */
    protected $table = 'chat_rooms';

    /**
     * Get the messages in this room
     *
     * @return array
     */

    public function messages() {
        $this->hasMany('App\ChatMessage');
    }
}

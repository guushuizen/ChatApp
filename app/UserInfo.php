<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    /**
     * Mass-assignable fields
     */

    protected $fillable = [ 'user_id' ];

    /**
     * One To One Relationship with User
     */

    public function user() {
        $this->belongsTo('App\User');
    }
}

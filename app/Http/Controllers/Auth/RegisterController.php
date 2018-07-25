<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\UserInfo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RegisterController extends Controller {

    /**
     * Handle a registration sent via the front-end
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */

    public function handleRegister(Request $request) {
        $password = bcrypt($request['password']);

        $user = User::create([
            'username' => $request['username'],
            'email' => $request['email'],
            'password' => $password
        ]);

        UserInfo::create([
            'user_id' => $user->id
        ]);

        return response()->json([
            'status' => 200
        ])->setStatusCode(200);
    }
}

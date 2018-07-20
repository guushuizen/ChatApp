<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class RegisterController extends Controller {

    /**
     * Handle a registration sent via the front-end
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */

    public function handleRegister(Request $request) {
        $password = bcrypt($request['password']);

        User::create([
            'username' => $request['username'],
            'email' => $request['email'],
            'password' => $password
        ]);

        return response()->json([
            'status' => 200
        ])->setStatusCode(200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Http\Response;

class UserController extends Controller
{
    /**
     * Return user info
     *
     * @param Request $request
     * @return Response
     */

    public function findUser(Request $request) {
        $userObj = User::where('username', $request['username'])->first();

        return response()->json([
            'user' => $userObj
        ]);
    }
}

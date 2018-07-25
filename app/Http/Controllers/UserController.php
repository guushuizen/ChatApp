<?php

namespace App\Http\Controllers;

use App\UserInfo;
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
        $userInfo = $userObj->info;

        return response()->json([
            'user' => $userObj,
            'userInfo' => $userInfo
        ]);
    }

    public function updateUser(Request $request, $id) {
//        echo PHP_EOL . $request->id . PHP_EOL;
        User::where('id', $id)->update([
            'email' => $request->email,
        ]);

        UserInfo::where('user_id', $request->user_id)->update([
            'street_address' => $request->street_address,
            'postal_code' => $request->postal_code,
            'city' => $request->city,
            'phone_number' => $request->phone_number
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
}

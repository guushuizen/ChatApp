<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function handleLogin(Request $request) {
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            return response()->json([
                'username' => Auth::user()->username,
                'user_id' => Auth::user()->id
            ])->setStatusCode(200);
        } else {
            return response()->json([
                'message' => 'Incorrect username and/or password. Please try again.'
            ])->setStatusCode(401);
        }
    }
}

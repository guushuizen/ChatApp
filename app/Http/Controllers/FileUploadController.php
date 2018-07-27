<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use WebSocket\Client;

class FileUploadController extends Controller
{

    function handleUpload(Request $request) {
        $path = $request->file->store('uploads', 'public');
        $username = $request->username;

        $client =  new Client("ws://127.0.0.1:8090");
        $client->send(json_encode([
            'type' => 'php_server',
            'path' => '/storage/' . $path,
            'name' => $request->file->hashName(),
            'username' => $username
        ]));

        $client->close();


        return response()->json([
            'status' => 200
        ]);
    }
}

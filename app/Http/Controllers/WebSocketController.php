<?php

namespace App\Http\Controllers;

use App\ChatRoom;
use App\User;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use App\ChatMessage;
use Illuminate\Http\Request;

class WebSocketController extends Controller implements MessageComponentInterface
{
    /**
     *  $connections format
     *
     * {
     *  [401] {
     *      'conn' => [Connection object]
     *      'user_id' => 'username'
     *      'messages' => [Messages array]
     *  }
     * }
     *
     */

    private $connections = [];

    /**
     * WebSocketController constructor.
     */
    public function __construct() {

    }


    /**
     * Called whenever a new connection opens.
     * Adds the ConnectionInterface to the $connections array.
     *
     * @param ConnectionInterface $conn
     */

    function onOpen(ConnectionInterface $conn)
    {
        echo PHP_EOL . 'A new connection opened (ID: ' . $conn->resourceId . ")";

        $this->connections[$conn->resourceId]['conn'] = $conn;

        echo var_dump($this->connections[$conn->resourceId]['conn']->resourceId);
    }

    /**
     * Called when a connection closes.
     *
     * @param ConnectionInterface $conn
     */

    function onClose(ConnectionInterface $conn)
    {
//        $disconnectedId = $conn->resourceId;
        $username = $this->connections[$conn->resourceId]['username'];
        unset($this->connections[$conn->resourceId]);

        echo PHP_EOL . 'User with connection id #' . $conn->resourceId . ' and username ' . $username . ' has disconnected.';

        //TODO: Send disconnected message to all other connections.
    }

    function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occured with a connection:" . $e->getMessage();
        echo "Stacktrace: " . $e->getTraceAsString();
    }

    /**
     * If it is the first message, the message should be the user's name. (ID)
     * After that, all messages received are regular chat messages.
     *
     * @param ConnectionInterface $conn
     * @param string $msg
     */

    function onMessage(ConnectionInterface $conn, $msg)
    {
        $data = json_decode($msg, true);
        if ($data['type'] == 'php_server') {
            unset($this->connections[$conn->resourceId]);
            $user_id = User::where('username', $data['username'])->first()->id;
            $chatroom_id = ChatRoom::where('name', $this->searchForConn($data['username'])['room'])->first()->id;
            $message = ChatMessage::create([
                'message' => '',
                'user_id' => $user_id,
                'username' => $data['username'],
                'chatroom_id' => $chatroom_id,
                'file_url' => $data['path'],
                'file_name' => $data['name']
            ]);

            $this->broadcast([
                'type' => 'new_file',
                'message' => $message
            ]);
        } else
        if ($data['type'] == 'identification') {
            $this->connections[$conn->resourceId]['username'] = $data['username'];
            $this->connections[$conn->resourceId]['user_id'] = $data['user_id'];
            $this->connections[$conn->resourceId]['room'] = ChatRoom::firstOrCreate(['name' => 'Lobby'])->name;

            $conn->send(json_encode(array(
                'type' => 'welcome',
                'room' => ChatRoom::first()->name,
                'messages' => ChatMessage::where('chatroom_id', ChatRoom::first()->id)->orderByDesc('created_at')->get(),
                'rooms' => ChatRoom::all(),
            )));

            echo PHP_EOL . 'Connection with ID: ' . $conn->resourceId . ' connected with username ' . $msg;
        } else
        if ($data['type'] == 'new_message') {
            // Not first message, thus we add the $msg to the owner's messages list and broadcast the message.
            $room = ChatRoom::where('name', $data['room'])->first();
            $newMessage = ChatMessage::create(array(
                'user_id' => $this->connections[$conn->resourceId]['user_id'],
                'username' => $this->connections[$conn->resourceId]['username'],
                'message' => $data['message'],
                'chatroom_id' => $room->id,
                'created_at' => date('j/m/Y G:i'),
                'file_url' => '',
                'file_name' => ''
            ));

            $this->broadcastNew($newMessage);
        } else
        if ($data['type'] == 'room-switch') {
            $newRoomName = $data['room'];
            $existed = ChatRoom::where('name', $newRoomName)->exists();
            $newRoom = ChatRoom::firstOrCreate(['name' => $newRoomName]);

            $conn->send(json_encode(array(
                'type' => 'room-switch',
                'room' => $data['room'],
                'messages' => ChatMessage::where('chatroom_id', $newRoom->id)->orderByDesc('created_at')->get(),
                'rooms' => ChatRoom::all(),
            )));

            if (!$existed) {
                $this->broadcast(array(
                    'type' => 'new_room',
                    'name' => $newRoom->name
                ));
            }

            $this->connections[$conn->resourceId]['room'] = $newRoom->name;
        }
    }

    /**
     * Send the new chat message to all connected sockets.
     *
     * @param String $msg (The chat message)
     */

    public function broadcastNew($msg) {
        foreach ($this->connections as $connection) {
            $connection['conn']->send(json_encode(array(
                'id' => $msg->id,
                'type' => 'new_message',
                'room' => ChatRoom::where('id', $msg->chatroom_id)->first()->name,
                'message' => $msg->message,
                'username' => $msg->username,
                'created_at' => $msg->created_at
            )));
        }
    }

    function broadcast($msg) {
        foreach ($this->connections as $connection) {
            $connection['conn']->send(json_encode($msg));
        }
    }

    function searchForConn($username) {
        foreach ($this->connections as $connection) {
            if ($connection['username'] == $username) {
                return $connection;
            }
        }

        return null;
    }
}

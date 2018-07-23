<?php

namespace App\Http\Controllers;

use App\User;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use App\ChatMessage;

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
        echo PHP_EOL . 'The websocket server is now listening for messages on port 8090';
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
        if ($data['type'] == 'identification') {
            $this->connections[$conn->resourceId]['username'] = $data['username'];
            $this->connections[$conn->resourceId]['user_id'] = $data['user_id'];
            $this->connections[$conn->resourceId]['channel'] = 'lobby';

            echo PHP_EOL . $this->connections[$conn->resourceId]['username'] . PHP_EOL;

            $conn->send(json_encode(array(
                'type' => 'welcome',
                'room' => 'lobby',
                'messages' => ChatMessage::where('room', 'lobby')->orderByDesc('created_at')->get(),
            )));

            echo PHP_EOL . 'Connection with ID: ' . $conn->resourceId . ' connected with username ' . $msg;
        } else
        if ($data['type'] == 'new_message') {
            echo PHP_EOL . var_dump($data) . PHP_EOL;
            // Not first message, thus we add the $msg to the owner's messages list and broadcast the message.
            $newMessage = ChatMessage::create(array(
                'user_id' => $this->connections[$conn->resourceId]['user_id'],
                'username' => $this->connections[$conn->resourceId]['username'],
                'room' => $data['room'],
                'message' => $data['message'],
                'created_at' => date('j/m/Y G:i')
            ));

            $this->broadcast($newMessage);
            echo PHP_EOL . 'New message from ' . $this->connections[$conn->resourceId]['username'] . ': ' . $msg;
        } else
        if ($data['type'] == 'room-switch') {
            $this->connections[$conn->resourceId]['channel'] = $data['room'];

            $conn->send(json_encode(array(
                'type' => 'room-switch',
                'room' => $data['room'],
                'messages' => ChatMessage::where('room', $data['room'])->orderByDesc('created_at')->get(),
            )));

            echo PHP_EOL . 'User ' . $data['username'] . ' switched to channel ' . $data['room'];
        }
    }

    /**
     * Send the new chat message to all connected sockets.
     *
     * @param String $msg (The chat message)
     */

    function broadcast($msg) {
        foreach ($this->connections as $connection) {
            $connection['conn']->send(json_encode(array(
                'id' => $msg->id,
                'type' => 'new_message',
                'room' => $msg->room,
                'message' => $msg->message,
                'username' => $msg->username,
                'created_at' => $msg->created_at
            )));
        }
    }
}

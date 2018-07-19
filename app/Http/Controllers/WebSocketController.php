<?php

namespace App\Http\Controllers;

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
     *      'username' => 'username'
     *      'messages' => [Messages array]
     *  }
     * }
     *
     */

    private $connections = [];
    private $messages = [];

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
//        echo PHP_EOL . print_r($this->connections[$conn->resourceId]);
        if (!isset($this->connections[$conn->resourceId]['username'])) {
            $this->connections[$conn->resourceId]['username'] = $msg;

            $conn->send(json_encode(array(
                'type' => 'welcome',
                'messages' => ChatMessage::orderByDesc('created_at')->get(),
            )));

            echo PHP_EOL . 'Connection with ID: ' . $conn->resourceId . ' connected with username ' . $msg;
        } else {
            // Not first message, thus we add the $msg to the owner's messages list and broadcast the message.
            $newMessage = ChatMessage::create(array(
                'username' => $this->connections[$conn->resourceId]['username'],
                'message' => $msg,
                'created_at' => date('j/m/Y G:i')

            ));

            $this->broadcast($newMessage);
            echo PHP_EOL . 'New message from ' . $this->connections[$conn->resourceId]['username'] . ': ' . $msg;
        }
    }

    function broadcast($msg) {
        foreach ($this->connections as $connection) {
            $connection['conn']->send(json_encode(array(
                'id' => $msg->id,
                'type' => 'new_message',
                'message' => $msg->message,
                'username' => $msg->username,
                'created_at' => $msg->created_at
            )));
        }
    }

}

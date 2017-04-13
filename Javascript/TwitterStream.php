<?php

require 'vendor/autoload.php';

use Impensavel\Floodgate\Floodgate;
use Impensavel\Floodgate\FloodgateException;

try {
    $config = [
        'oauth' => [
            'consumer_key'    => 'bOoUz06VrazMxiQwLGSQN7dfo',
            'consumer_secret' => 'oKRdgqLMuC7fXlYd6gqCNAbxbzLLvz8PN3l5Pz8HyXJbP2S2Vr',
            'token'           => '2497069099-8YgNNNTWwfd5HCqVOP6iBBVL8eWmlzcdIBwehGU',
            'token_secret'    => 'OIHuyx5r1VH81CeYajSeZbnOKnOQd5lzi9UNxpJjQ3a2w',
        ],
    ];

    $floodgate = Floodgate::create($config);
    $jsonData = array();
    define('START_TIME', time());
    // Data handler
    $handler = function ($message) {
        // dump each message from the stream
        global $jsonData;
        if (time() - START_TIME < 15) {
            $main = (array)$message;
            $user = (array)$main['user'];
            if($user['location'] != ''){
              $temp = array("name"=>$user['name'],"location"=>$user['location'],"tweet"=>$main['text']);
              array_push($jsonData, $temp);
            }
        } else {
            echo json_encode($jsonData);
            exit(1);
        }

    };

    // API endpoint parameter generator
    $generator = function () {
        return [
            'track' => $_POST["filter"],
        ];
    };

    // consume the Twitter Streaming API filter endpoint
    $floodgate->filter($handler, $generator);

} catch (FloodgateException $e) {
    // handle exceptions
}

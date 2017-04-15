<?php

require_once('TwitterStream.php');

$stream = new TwitterStream(array(
    'consumer_key'    => "bOoUz06VrazMxiQwLGSQN7dfo",
    'consumer_secret' => "oKRdgqLMuC7fXlYd6gqCNAbxbzLLvz8PN3l5Pz8HyXJbP2S2Vr",
    'token'           => "2497069099-8YgNNNTWwfd5HCqVOP6iBBVL8eWmlzcdIBwehGU",
    'token_secret'    => "OIHuyx5r1VH81CeYajSeZbnOKnOQd5lzi9UNxpJjQ3a2w"
));

$res = $stream->getStatuses(['track' => 'trump'], function($tweet) {
    //prints to the screen statuses as they come along
    print_r($tweet);
});
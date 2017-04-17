<?php

require 'vendor/autoload.php';

use Impensavel\Floodgate\Floodgate;
use Impensavel\Floodgate\FloodgateException;
//use Aws\ElasticsearchService\ElasticsearchPhpHandler;
use Elasticsearch\ClientBuilder;

// // Create a handler (with the region of your Amazon Elasticsearch Service domain)
// $handler = new ElasticsearchPhpHandler('us-west-2');
//
// // Use this handler to create an Elasticsearch-PHP client
// $client = ClientBuilder::create()
//     ->setHandler(new ElasticsearchPhpHandler('us-west-2'))
//     ->setHosts(['https://search-foo-3gn4utxfus5cqpn89go4z5lbsm.us-west-2.es.amazonaws.com:443'])
//     ->build();

$client = ClientBuilder::create()->build();
$jsonData = array();
$error_msg = null;
$error_code = 200;
$OPERATION = $_POST['OPERATION'];

if (empty($OPERATION)) {
    $error_msg = 'Invalid Request';
} else {
    if ($OPERATION == 'GET_FILTERED_STREAM') {
        if (isset($_POST["filter"])) {
            try {
                $config = [
                    'oauth' => [
                        'consumer_key'    => 'bOoUz06VrazMxiQwLGSQN7dfo',
                        'consumer_secret' => 'oKRdgqLMuC7fXlYd6gqCNAbxbzLLvz8PN3l5Pz8HyXJbP2S2Vr',
                        'token'           => '2497069099-8YgNNNTWwfd5HCqVOP6iBBVL8eWmlzcdIBwehGU',
                        'token_secret'    => 'OIHuyx5r1VH81CeYajSeZbnOKnOQd5lzi9UNxpJjQ3a2w',
                    ],
                ];
                define('START_TIME', time());
                $floodgate = Floodgate::create($config);

                // Data handler
                $handler = function ($message) {

                    // dump each message from the stream
                    global $jsonData,$client;
                    if (time() - START_TIME < 15) {
                        if ($main = (array)$message) {
                            if ($main['user']) {
                                $user = (array)$main['user'];
                                if ($user['location'] && $user['location'] != '' && $user['lang'] == 'en') {
                                    //$temp = array("name" => $user['name'], "location" => $user['location'], "tweet" => $main['text']);
                                    $fullurl = "http://maps.googleapis.com/maps/api/geocode/json?address=".$user['location'];
                                    $locationString = file_get_contents($fullurl); // get json content
                                    $json_a = json_decode($locationString, true); //json decoder
                                    $latVal = $json_a['results'][0]['geometry']['location']['lat'];
                                    $lngVal = $json_a['results'][0]['geometry']['location']['lng'];
                                    if($latVal && $lngVal) {

                                        $params = [
                                            'index' => 'tweets',
                                            'type' => 'vinit',
                                            'body' => ['user' => $user['name'],
                                                'lat' => $latVal,
                                                'lng' => $lngVal,
                                                'tweet' => $main['text'],
                                                'my_id' => $_POST["filter"]
                                            ]
                                        ];

                                        $client->index($params);
                                    }
                                } else echo false;
                            } else echo false;
                        } else false;
                    } else {
                    echo true;
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


        } else {
        $error_msg = 'Parameter Data not sufficient.';
    }

} else if($OPERATION == 'GET_FILTERED_DATA') {
    if (isset($_POST["index"]) && isset($_POST["doc_type"]) && isset($_POST["match_Field"]) && isset($_POST["data"])) {
        $params = [
            'index' => $_POST["index"],
            'type' => $_POST["doc_type"],
            'body' => [
                'query' => [
                    'match' => [
                        $_POST["match_Field"] => $_POST["data"]
                    ]
                ],
                'from' => 0,
                'size' => 1000

            ]
        ];

        $response = $client->search($params);
        echo json_encode($response);
    } else {
        $error_msg = 'Parameter Data not sufficient.';
    }

}


}

if (!empty($error_msg) || $error_code != 200) {
    switch ($error_code) {
        case 401:
            header("HTTP/1.0 401 Unauthorized");
            $error_msg = 'Not Authorized';
            break;
        default:
            header("HTTP/1.0 406 Not Acceptable");
    }
    $error_msg = $error_msg ? $error_msg : "Unknown Server Error";
    die($error_msg);
}

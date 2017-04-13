
var response = null;
var searchText = document.getElementById('tweetSearch');

function getData() {

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:9200/tweets/tweet/_search/';
    var parameters = 'size=1000&from=0';
    console.log(searchText.value);
    if(searchText.value !== ''){
        parameters = parameters + '&q=my_id:'+searchText.value;
    }
    console.log(parameters);
    xhr.open("GET", url+"?"+parameters, true);
     var formData = new FormData;
     //formData.append("size", "1000");
     //formData.append("from", "0");
     //formData.append("q", "my_id:trump");
    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                response = JSON.parse(xhr.responseText);
                initMap();
            }
            else {
                alert('Error '+xhr.status);
            }
        }

    };
    xhr.send(formData);
}

function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: {lat: 39.0550557, lng: 4.0322128}
        });
        var data = response["hits"]["hits"];
        console.log(data);
        data.forEach(function(index) {
            var singleEntry = index["_source"];
            new google.maps.Marker({
                position: singleEntry['location'],
                map: map
            });
        });
        //searchText.value = "* All Tweets *";
}

function searchSpecific() {
    streamData();
    //getData();
}

function streamData() {
    var url = "https://stream.twitter.com/1.1/statuses/filter.json";
    // var accessor = {
    //     token: "2497069099-8YgNNNTWwfd5HCqVOP6iBBVL8eWmlzcdIBwehGU",
    //     tokenSecret: "OIHuyx5r1VH81CeYajSeZbnOKnOQd5lzi9UNxpJjQ3a2w",
    //     consumerKey : "bOoUz06VrazMxiQwLGSQN7dfo",
    //     consumerSecret: "oKRdgqLMuC7fXlYd6gqCNAbxbzLLvz8PN3l5Pz8HyXJbP2S2Vr"
    // };
    // var message = {
    //     action: url,
    //     method: "POST",
    //     parameters: {}
    // };
    // OAuth.completeRequest(message, accessor);
    // OAuth.SignatureMethod.sign(message, accessor);
    // url = url + '?' + OAuth.formEncode(message.parameters);
    // var messageLen = 0;
    //
    // var postdata= "oauth_consumer_key=bOoUz06VrazMxiQwLGSQN7dfo&oauth_token=2497069099-8YgNNNTWwfd5HCqVOP6iBBVL8eWmlzcdIBwehGU&oauth_version=1.0&oauth_timestamp=1491859103&oauth_nonce=OoQsVG&oauth_signature_method=HMAC-SHA1&oauth_signature=hltwYCNHXyfNt4Lj43oqKRKhR4s%3D&filter=trump"; //Probably need the escape method for values here, like you did
    // //Send the proper header information along with the request
    //
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', url, true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhr.onreadystatechange = function() {
    //     if(xhr.readyState == 2 && xhr.status == 200) {
    //         // Connection is ok
    //         alert('conn ok 2');
    //     } else if(xhr.readyState == 3){
    //         //Receiving stream
    //         if (messageLen < xhr.responseText.length){
    //             alert(messageLen +"-"+ xhr.responseText.length +":"+xhr.responseText.substring(messageLen,xhr.responseText.length));
    //         }
    //         messageLen = xhr.responseText.length;
    //     }else if(xhr.readyState == 4) {}
    //     // Connection completed
    //     alert('complete');
    // };
    //
    // xhr.send(postdata);



}


var map = null;

function plotData(response) {
    if(response) {
        var boolCheck = true;
        var data = response["hits"]["hits"];

        data.forEach(function (index) {
            var singleEntry = index["_source"];
            if(boolCheck){
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: {lat: parseFloat(singleEntry['lat']), lng: parseFloat(singleEntry['lng'])}
                });
                boolCheck = false;
            }
            new google.maps.Marker({
                position: {lat: parseFloat(singleEntry['lat']), lng: parseFloat(singleEntry['lng'])},
                map: map,

            });
        });
    }
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 39.0550557, lng: 4.0322128}
    });
}



function searchSpecific(searchTextValue) {

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "twitterStream.php", true);
    var formData = new FormData;
    formData.append("OPERATION", "GET_FILTERED_DATA");
    formData.append("index", "tweets");
    formData.append("doc_type", "vinit");
    formData.append("match_Field", "my_id");
    formData.append("data", searchTextValue);

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
                plotData(response);
            }
            else {
                alert('Error '+xhr.status);
            }
        }

    };
    xhr.send(formData);
}

function streamData() {

    var searchTextValue = document.getElementById('tweetSearch').value;
    var searchButton = document.getElementById('searchButton');

    if(searchTextValue === '') {alert('Please Enter a Filter!'); return;}
    searchButton.src = "loading.gif";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "twitterStream.php", true);
    var formData = new FormData;
    formData.append("OPERATION", "GET_FILTERED_STREAM");
    formData.append("filter", searchTextValue);

    $('#progress').css('width', "1%");
    $("#progress").removeClass("done");
    $({property: 1}).animate({property: 106}, {
        duration: 17000,
        step: function() {
            var percentValue = Math.round(this.property);
            $('#progress').css('width',  percentValue+"%");
        }
    });

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                //var response = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
                // if(xhr.responseText === '1'){
                //     $("#progress").addClass("done");
                //     searchButton.src = "search.png";
                //     searchSpecific(searchTextValue);
                // }
            }
        }

    };
    xhr.send(formData);

}


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
  console.log('called');
  var searchValue = document.getElementById('tweetSearch').value;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "twitterStream.php", true);
  var formData = new FormData;
  formData.append("filter", searchValue);
  xhr.onreadystatechange = function () {//Call a function when the state changes.
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        //var response = JSON.parse(xhr.responseText);
        console.log(xhr.responseText);
      }
    }

  };
  xhr.send(formData);

}

$(document).ready(function() {
    getData();

});

function getData() {

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:9200/tweets/tweet/_search/';
    var parameters = 'size=1000&from=0&q=my_id:trump';
    xhr.open("GET", url+"?"+parameters, true);
     var formData = new FormData;
     //formData.append("size", "1000");
     //formData.append("from", "0");
     //formData.append("q", "my_id:trump");
    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                document.getElementById('dataRec').innerHTML = xhr.responseText;
            }
            else {
            }
        }

    };
    xhr.send(formData);
}

from django.shortcuts import render
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
from elasticsearch import Elasticsearch
import elasticsearch
import time
import json
import geocoder
from django.views.decorators.csrf import csrf_protect
from requests_aws4auth import AWS4Auth

# Create your views here.
@csrf_protect
def index(request):
    return render(request,"index.html",{"my_data":"false","firstCheck":"true"})

@csrf_protect
def home(request):
    con_key ='YOUR_KEY'
    con_secret ='YOUR_KEY'
    acess_token ='YOUR_KEY'
    acess_secret = 'YOUR_KEY'

    # create instance of elasticsearch
    host = 'YOUR_KEY'
    awsauth = AWS4Auth('YOUR_KEY', 'YOUR_KEY', 'us-west-2', 'es')
    es = elasticsearch.Elasticsearch(
        hosts=[{'host': host, 'port': 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=elasticsearch.connection.RequestsHttpConnection
    )

    class TweetStreamListener(StreamListener):

        def __init__(self, time_limit=10):
            self.start_time = time.time()
            self.limit = time_limit

        # on success
        def on_data(self, data):

            # decode json
            dict_data = json.loads(data)

            if (time.time() - self.start_time) < self.limit:
                if 'user' in dict_data and dict_data['user']['location']:
                    try:
                        doc = {"author": dict_data["user"]["screen_name"],
                               "date": dict_data["created_at"],
                               "location": dict_data['user']['location'],
                               "lat": geocoder.google(dict_data['user']['location']).latlng[0],
                               "lng": geocoder.google(dict_data['user']['location']).latlng[1],
                               "message": dict_data["text"],
                               "my_id": query}
                        es.index(index="tweetmap",doc_type="tweets",body=doc)
                    except:
                        pass
                    return True
            else:
                return False

        # on failure
        def on_error(self, status):
            print(status)


    # create instance of the tweepy tweet stream listener
    listener = TweetStreamListener()

    # set twitter keys/tokens
    auth = OAuthHandler(con_key, con_secret)
    auth.set_access_token(acess_token, acess_secret)

    # create instance of the tweepy stream
    stream = Stream(auth, listener)

    query = str(request.POST.get('myword'))

    stream.filter(track=[query,'#'+query])

    pass_list = {}

    pass_list.setdefault('tweet', [])

    res = es.search(size=5000, index="tweetmap", doc_type="tweets", body={
        "query":{
            "match" : { "my_id": query}
        }
    })

    for j in res['hits']['hits']:
        pass_list['tweet'].append(j['_source'])

    pass_list_final = json.dumps(pass_list)

    return render(request,"index.html",{"my_data":pass_list_final,"firstCheck":"false"})

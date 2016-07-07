#loader and updator for mapbox dataset

#virtualenv -p /usr/local/bin/python2.7 ENV
#source ENV/bin/activate


#depdencies
import base64
import json
import os
import time 

#from mapbox.services.datasets import Datasets
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from xml.etree import ElementTree
from dateutil.parser import parse
from datetime import datetime, timedelta

#cat  39 rest
#subcat
#restraraunts 250
#sweet treats 251
#coffee 246
#wineries 384



svurl = 'http://sedona.simpleviewcrm.com/webapi/listings/xml/listings.cfm'

pstdata = {'action': 'getListings', 'username': 'SedonaMaps_API','password': 'cart0gr@phick!', 'pagenum': '1','pagesize': '200', 'filters': '<FILTERGROUP> <ANDOR>OR</ANDOR>     <FILTERS>         <ITEM>             <FILTERTYPE>EQUAL TO</FILTERTYPE>             <FIELDCATEGORY>LISTING</FIELDCATEGORY>             <FILTERVALUE>124</FILTERVALUE>             <FIELDNAME>SubCatID</FIELDNAME>         </ITEM>     </FILTERS> </FILTERGROUP>'}
#headers = {'Content-Type': 'application/xml'}
r = requests.post(svurl, data=pstdata)
print r.text


tree = ElementTree.fromstring(r.content)
tree[0][0].find('SORTCOMPANY').text
tree[0][0].find('LASTUPDATED').text
tree[0][0].find('PHOTOFILE').text

ld = parse(tree[0][0].find('LASTUPDATED').text)
present = datetime.now()

diftime = present - ld
if(diftime> timedelta(days = 7))
#for q in collection:
	



#l = open('data.json', 'w')
#l.write("\nProecessing file: "+filename)
#l.write("\nVariables: "+str(nc.variables))
#l.write("\nList of Files Processed: "+str(date_file_list))
#l.write("\nSuccess for "+str(dates[0]))
#l.close()





#mapbox api work that is not working because it is still in private beta

#pip install mapbox 

#import urllib3
#urllib3.disable_warnings()
#username = 'sedonachamber'
#layerid = 'sedonachamber.pmj9fija'
#layerid_no = 'pmj9fija'

#export MAPBOX_ACCESS_TOKEN="sk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW5qYXFjeHYweG5hdWlranFxZHpxYXhrIn0.2oaLx8HQUCtSzef6ozEaiQ"
#datasets
#https://api.mapbox.com/datasets/v1/sedonachamber?access_token=tk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImV4cCI6MTQ2MTgwMTE1OCwiaWF0IjoxNDYxNzk3NTU4LCJzY29wZXMiOlsiZXNzZW50aWFscyIsInNjb3BlczpsaXN0IiwibWFwOnJlYWQiLCJtYXA6d3JpdGUiLCJ1c2VyOnJlYWQiLCJ1c2VyOndyaXRlIiwidXBsb2FkczpyZWFkIiwidXBsb2FkczpsaXN0IiwidXBsb2Fkczp3cml0ZSIsInN0eWxlczp0aWxlcyIsInN0eWxlczpyZWFkIiwiZm9udHM6cmVhZCIsInN0eWxlczp3cml0ZSIsInN0eWxlczpsaXN0Iiwic3R5bGVzOmRyYWZ0IiwiZm9udHM6bGlzdCIsImZvbnRzOndyaXRlIiwiZm9udHM6bWV0YWRhdGEiLCJkYXRhc2V0czpyZWFkIiwiZGF0YXNldHM6d3JpdGUiLCJhbmFseXRpY3M6cmVhZCJdLCJjbGllbnQiOiJtYXBib3guY29tIiwibGwiOjE0NjE3ODcwNzc0NTIsIml1IjpudWxsfQ.0qsIue6a3MnAk7cNRdetCA&_=1461797576833
#os.environ['MAPBOX_ACCESS_TOKEN']
#YOUR_ACCESS_TOKEN = os.environ['MAPBOX_ACCESS_TOKEN']


#requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

#idlayer = 'cin2p1rmm0bqvvhm47cjvcsor'
#access_token = 'pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg'
#secretkey = 'sk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW5qYXFjeHYweG5hdWlranFxZHpxYXhrIn0.2oaLx8HQUCtSzef6ozEaiQ'
#datasets = Datasets()
#datasets.session.params['access_token'] = access_token

#datasets.list().json()
#response = Datasets(access_token=secretkey).read_dataset(idlayer).json()
#collection = datasets.list_features(idlayer).json()

#tokenurl = "https://www.mapbox.com/core/tokens/v1?_="+str(int(time.time()))
#r = requests.get(tokenurl);

#read
#resp = datasets.read_feature(idlayer, '2')

#update
#update = {'type': 'Feature', 'id': '2', 'properties': {'name': 'Insula Nulla C'},
#	'geometry': {'type': 'Point', 'coordinates': [0, 0]}}

#update = datasets.update_feature(idlayer, '2', update).json()
#update['properties']['name']

# import responses
# responses.add(
#     responses.GET,
#     'https://api.mapbox.com/datasets/v1/{0}/{1}?access_token={2}'.format(
#         username, 'testing', access_token),
#     match_querystring=True,
#     body=json.dumps(
#         {'name': 'things', 'description': 'a collection of things'}),
#     status=200,
#     content_type='application/json')

#create
#create_resp = datasets.create(name='test', description='test')
#loader and updator for mapbox dataset
#simple view api to Geojson
#sontag SUmmer 2016
#mapblender.com
#walksedona.com

#virtualenv -p /usr/local/bin/python2.7 ENV
#source ENV/bin/activate


#depdencies
import base64,sys
import json,string

import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from xml.etree import ElementTree

import os
#import time 
#from dateutil.parser import parse
#from datetime import datetime, timedelta


#open jsonfile
jsonfile = open('../data/restaurant.json', 'w')
jsonfile.write("""{
  "type": "FeatureCollection",
  "features": [""");

#cat  23 art
cat = 23
#subcat
subcat = [125,124,123,283]

#simplview API url
svurl = 'http://sedona.simpleviewcrm.com/webapi/listings/xml/listings.cfm'


#loop through categories and create geojson from values
for subcatid in subcat:

	pstdata = {'action': 'getListings', 'username': 'SedonaMaps_API','password': 'cart0gr@phick!', 'pagenum': '1','pagesize': '200', 'filters': '<FILTERGROUP> <ANDOR>OR</ANDOR><FILTERS><ITEM><FILTERTYPE>EQUAL TO</FILTERTYPE><FIELDCATEGORY>LISTING</FIELDCATEGORY><FILTERVALUE>'+str(subcatid)+'</FILTERVALUE><FIELDNAME>SubCatID</FIELDNAME></ITEM></FILTERS></FILTERGROUP>'}

	responsePost = requests.post(svurl, data=pstdata)
	
	treeXML = ElementTree.fromstring(responsePost.content)

	for recordelement in treeXML[0]:

		individualID = recordelement.find('LISTINGID').text;
		companyName = recordelement.find('SORTCOMPANY').text;
		photo = str(recordelement.find('IMGPATH').text)+str(recordelement.find('PHOTOFILE').text);
		websiteURL = str(recordelement.find('WEBURL').text);

		#print photo;
		listingdata = {'action': 'getListing', 'username': 'SedonaMaps_API','password': 'cart0gr@phick!', 'LISTINGID': individualID};
		individualInfo = requests.post(svurl, data=listingdata);

		listingXML = ElementTree.fromstring(individualInfo.content);

		if(listingXML[0].find('ACCTSTATUS').text=='Active'):
			#could check for update but now just create everything
			#print listingXML[0].find('LASTUPDATED').text;
			
			TBmember = '';
			gpslocation = '';

			for itemNode in listingXML[0].find('ADDITIONALINFORMATION'):
				
				if(itemNode.find('NAME').text == 'Tourism Bureau'):
					TBmember = itemNode.find('VALUE').text;
				
				if(itemNode.find('NAME').text == 'GPS Coordinates'):
					gpslocation= itemNode.find('VALUE').text;

			
			#create json node
			if(gpslocation != '' and gpslocation != None and TBmember == 'Yes'):

				print companyName
				print TBmember
				print gpslocation

				if(recordelement.find('PHOTOFILE').text != None):
					description = """<a href=\\\""""""+websiteURL+"""\\" target=\\"_blank\\"><img src=\\\""""""+photo+"""\\" height=\\"160\\" width=\\"160\\"></a><br><a href=\\\""""""+websiteURL+"""\\" target=\\"_blank\\">Visit Site for More Info!</a><br>7 Minute Walk </a>""";
				else:
					description = """<br><a href=\\\""""""+websiteURL+"""\\" target=\\"_blank\\">Visit website for more info!</a><div id=\\"direc\\"><a target=\\"_blank\\">Get Directions!</a></div>""";
				

				jsonfile.write("""{
				      "type": "Feature",
				      "properties": {
				        "id": "marker-"""+individualID+"""",
				        "title": \""""+companyName+"""\",
				        "description": \""""+description+"""\",
				        "marker-size": "medium",
				        "marker-color": "#1087bf",
				        "marker-symbol": "art-gallery"
				      },
				      "geometry": {
				        "coordinates": ["""+
				          gpslocation.split(',')[1]+""",
				          """+gpslocation.split(',')[0]+"""
				        ],
				        "type": "Point"
				      },
				      "id": """+individualID+"""
				    },""""");
				
				#switch coordindates
				#gpslocation.split(',')[0];
				#gpslocation.split(',')[1];
				
#remove last comma
jsonfile.seek(-1, os.SEEK_END)
jsonfile.truncate()
jsonfile.write("""  ],
  "id": "sedonachamber.art"
}""");



#send email
import smtplib

server = smtplib.SMTP_SSL('smtpout.secureserver.net', 465)
server.ehlo()
server.login("stephen@mapblender.org", "Imfromnh55")

fromaddr = "stephen@mapblender.org";
toaddr = "sontag.stephen@gmail.com";

msg = string.join((
        "From: %s" % fromaddr,
        "To: %s" % toaddr,
        "Subject: %s" % "File Created",
        "",
        "Success"), "\r\n");
server.sendmail(fromaddr, toaddr, msg)



jsonfile.close()

sys.exit()